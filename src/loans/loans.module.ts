import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { Loan } from './models/loan.model';
import { User } from '../users/models/user.model';
import { Book } from '../books/models/book.model';
import { Category } from '../categories/models/category.model';
import { Author } from '../authors/models/author.model';
import { BookAuthor } from '../books/models/book-author.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Loan, User, Book, Category, Author, BookAuthor]),
  ],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}
