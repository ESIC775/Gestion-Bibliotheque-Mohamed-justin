import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Author } from './models/author.model';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Book } from '../books/models/book.model';
import { Category } from '../categories/models/category.model';

@Injectable()
export class AuthorsService {
  constructor(@InjectModel(Author) private readonly authorModel: typeof Author) {}

  create(createAuthorDto: CreateAuthorDto) {
    return this.authorModel.create({ ...createAuthorDto });
  }

  findAll() {
    return this.authorModel.findAll({
      include: [{ model: Book, include: [Category] }],
      order: [['id', 'ASC']],
    });
  }

  async findOne(id: number) {
    const author = await this.authorModel.findByPk(id, {
      include: [{ model: Book, include: [Category] }],
    });

    if (!author) {
      throw new NotFoundException(`Auteur ${id} introuvable.`);
    }

    return author;
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.findOne(id);
    return author.update({ ...updateAuthorDto });
  }

  async remove(id: number) {
    const author = await this.findOne(id);
    await author.destroy();
    return { message: `Auteur ${id} supprimé avec succès.` };
  }
}
