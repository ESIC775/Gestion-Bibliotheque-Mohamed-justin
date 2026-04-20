import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book } from './models/book.model';
import { BookAuthor } from './models/book-author.model';
import { Category } from '../categories/models/category.model';
import { Author } from '../authors/models/author.model';
import { Loan } from '../loans/models/loan.model';
import { User } from '../users/models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Book, BookAuthor, Category, Author, Loan, User]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
