import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Book } from './models/book.model';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Category } from '../categories/models/category.model';
import { Author } from '../authors/models/author.model';
import { Loan } from '../loans/models/loan.model';
import { User } from '../users/models/user.model';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book) private readonly bookModel: typeof Book,
    @InjectModel(Category) private readonly categoryModel: typeof Category,
    @InjectModel(Author) private readonly authorModel: typeof Author,
  ) {}

  async create(createBookDto: CreateBookDto) {
    await this.ensureCategoryExists(createBookDto.categoryId);
    const authors = await this.ensureAuthorsExist(createBookDto.authorIds);

    if (createBookDto.availableCopies > createBookDto.totalCopies) {
      throw new BadRequestException(
        'Le nombre d’exemplaires disponibles ne peut pas dépasser le total.',
      );
    }

    const book = await this.bookModel.create({
      title: createBookDto.title,
      isbn: createBookDto.isbn,
      publishedYear: createBookDto.publishedYear,
      totalCopies: createBookDto.totalCopies,
      availableCopies: createBookDto.availableCopies,
      summary: createBookDto.summary,
      coverUrl: createBookDto.coverUrl,
      categoryId: createBookDto.categoryId,
    });

    await book.$set('authors', authors);
    return this.findOne(book.id);
  }

  findAll() {
    return this.bookModel.findAll({
      include: [Category, Author, { model: Loan, include: [User] }],
      order: [['id', 'ASC']],
    });
  }

  async findOne(id: number) {
    const book = await this.bookModel.findByPk(id, {
      include: [Category, Author, { model: Loan, include: [User] }],
    });

    if (!book) {
      throw new NotFoundException(`Livre ${id} introuvable.`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.findOne(id);

    if (updateBookDto.categoryId) {
      await this.ensureCategoryExists(updateBookDto.categoryId);
    }

    if (
      updateBookDto.availableCopies !== undefined &&
      updateBookDto.totalCopies !== undefined &&
      updateBookDto.availableCopies > updateBookDto.totalCopies
    ) {
      throw new BadRequestException(
        'Le nombre d’exemplaires disponibles ne peut pas dépasser le total.',
      );
    }

    const nextTotal = updateBookDto.totalCopies ?? book.totalCopies;
    const nextAvailable = updateBookDto.availableCopies ?? book.availableCopies;
    if (nextAvailable > nextTotal) {
      throw new BadRequestException(
        'Le nombre d’exemplaires disponibles ne peut pas dépasser le total.',
      );
    }

    await book.update({
      title: updateBookDto.title ?? book.title,
      isbn: updateBookDto.isbn ?? book.isbn,
      publishedYear: updateBookDto.publishedYear ?? book.publishedYear,
      totalCopies: nextTotal,
      availableCopies: nextAvailable,
      summary: updateBookDto.summary ?? book.summary,
      coverUrl: updateBookDto.coverUrl ?? book.coverUrl,
      categoryId: updateBookDto.categoryId ?? book.categoryId,
    });

    if (updateBookDto.authorIds) {
      const authors = await this.ensureAuthorsExist(updateBookDto.authorIds);
      await book.$set('authors', authors);
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    await book.destroy();
    return { message: `Livre ${id} supprimé avec succès.` };
  }

  private async ensureCategoryExists(categoryId: number) {
    const category = await this.categoryModel.findByPk(categoryId);
    if (!category) {
      throw new NotFoundException(`Catégorie ${categoryId} introuvable.`);
    }
    return category;
  }

  private async ensureAuthorsExist(authorIds: number[]) {
    const authors = await this.authorModel.findAll({ where: { id: authorIds } });
    if (authors.length !== authorIds.length) {
      throw new NotFoundException(
        'Un ou plusieurs auteurs fournis sont introuvables.',
      );
    }
    return authors;
  }
}
