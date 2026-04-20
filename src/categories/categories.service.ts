import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './models/category.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Book } from '../books/models/book.model';
import { Author } from '../authors/models/author.model';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private readonly categoryModel: typeof Category,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryModel.create({ ...createCategoryDto });
  }

  findAll() {
    return this.categoryModel.findAll({
      include: [{ model: Book, include: [Author] }],
      order: [['id', 'ASC']],
    });
  }

  async findOne(id: number) {
    const category = await this.categoryModel.findByPk(id, {
      include: [{ model: Book, include: [Author] }],
    });

    if (!category) {
      throw new NotFoundException(`Catégorie ${id} introuvable.`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    return category.update({ ...updateCategoryDto });
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await category.destroy();
    return { message: `Catégorie ${id} supprimée avec succès.` };
  }
}
