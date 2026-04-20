import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { Author } from './models/author.model';
import { Book } from '../books/models/book.model';
import { Category } from '../categories/models/category.model';
import { BookAuthor } from '../books/models/book-author.model';

@Module({
  imports: [SequelizeModule.forFeature([Author, Book, Category, BookAuthor])],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [AuthorsService],
})
export class AuthorsModule {}
