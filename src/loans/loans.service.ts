import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Loan } from './models/loan.model';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { User } from '../users/models/user.model';
import { Book } from '../books/models/book.model';
import { Category } from '../categories/models/category.model';
import { Author } from '../authors/models/author.model';

@Injectable()
export class LoansService {
  constructor(
    @InjectModel(Loan) private readonly loanModel: typeof Loan,
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Book) private readonly bookModel: typeof Book,
  ) {}

  async create(createLoanDto: CreateLoanDto) {
    const user = await this.userModel.findByPk(createLoanDto.userId);
    if (!user) {
      throw new NotFoundException(`Utilisateur ${createLoanDto.userId} introuvable.`);
    }

    const book = await this.bookModel.findByPk(createLoanDto.bookId);
    if (!book) {
      throw new NotFoundException(`Livre ${createLoanDto.bookId} introuvable.`);
    }

    if (book.availableCopies <= 0) {
      throw new BadRequestException(
        'Aucun exemplaire disponible pour ce livre.',
      );
    }

    const loan = await this.loanModel.create({
      dueDate: new Date(createLoanDto.dueDate),
      userId: createLoanDto.userId,
      bookId: createLoanDto.bookId,
      borrowedAt: new Date(),
      status: 'BORROWED',
    });

    await book.update({ availableCopies: book.availableCopies - 1 });
    return this.findOne(loan.id);
  }

  findAll() {
    return this.loanModel.findAll({
      include: [
        User,
        { model: Book, include: [Category, Author] },
      ],
      order: [['id', 'ASC']],
    });
  }

  async findOne(id: number) {
    const loan = await this.loanModel.findByPk(id, {
      include: [
        User,
        { model: Book, include: [Category, Author] },
      ],
    });

    if (!loan) {
      throw new NotFoundException(`Emprunt ${id} introuvable.`);
    }

    return loan;
  }

  async update(id: number, updateLoanDto: UpdateLoanDto) {
    const loan = await this.findOne(id);
    const rawLoan = await this.loanModel.findByPk(id);
    if (!rawLoan) {
      throw new NotFoundException(`Emprunt ${id} introuvable.`);
    }

    const book = await this.bookModel.findByPk(rawLoan.bookId);
    if (!book) {
      throw new NotFoundException(`Livre ${rawLoan.bookId} introuvable.`);
    }

    if (updateLoanDto.userId) {
      const user = await this.userModel.findByPk(updateLoanDto.userId);
      if (!user) {
        throw new NotFoundException(`Utilisateur ${updateLoanDto.userId} introuvable.`);
      }
    }

    if (updateLoanDto.bookId && updateLoanDto.bookId !== rawLoan.bookId) {
      throw new BadRequestException(
        'Le livre associé à un emprunt existant ne peut pas être modifié.',
      );
    }

    const nextStatus = updateLoanDto.status ?? rawLoan.status;

    if (rawLoan.status === 'BORROWED' && nextStatus === 'RETURNED') {
      await book.update({ availableCopies: book.availableCopies + 1 });
    }

    if (rawLoan.status === 'RETURNED' && nextStatus === 'BORROWED') {
      if (book.availableCopies <= 0) {
        throw new BadRequestException(
          'Impossible de repasser l’emprunt en BORROWED : aucun exemplaire disponible.',
        );
      }
      await book.update({ availableCopies: book.availableCopies - 1 });
    }

    await rawLoan.update({
      dueDate: updateLoanDto.dueDate
        ? new Date(updateLoanDto.dueDate)
        : rawLoan.dueDate,
      returnedAt:
        updateLoanDto.returnedAt !== undefined
          ? new Date(updateLoanDto.returnedAt)
          : nextStatus === 'RETURNED' && !rawLoan.returnedAt
            ? new Date()
            : rawLoan.returnedAt,
      status: nextStatus,
      userId: updateLoanDto.userId ?? rawLoan.userId,
    });

    return this.findOne(id);
  }

  async remove(id: number) {
    const loan = await this.findOne(id);
    const rawLoan = await this.loanModel.findByPk(id);
    if (!rawLoan) {
      throw new NotFoundException(`Emprunt ${id} introuvable.`);
    }

    if (rawLoan.status === 'BORROWED') {
      const book = await this.bookModel.findByPk(rawLoan.bookId);
      if (book) {
        await book.update({ availableCopies: book.availableCopies + 1 });
      }
    }

    await rawLoan.destroy();
    return { message: `Emprunt ${id} supprimé avec succès.` };
  }
}
