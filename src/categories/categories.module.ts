import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './models/category.model';
import { Book } from '../books/models/book.model';
import { Author } from '../authors/models/author.model';
import { BookAuthor } from '../books/models/book-author.model';

@Module({
  imports: [SequelizeModule.forFeature([Category, Book, Author, BookAuthor])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
