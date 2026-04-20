import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { MemberProfile } from '../profiles/models/member-profile.model';
import { Loan } from '../loans/models/loan.model';
import { Book } from '../books/models/book.model';

@Module({
  imports: [SequelizeModule.forFeature([User, MemberProfile, Loan, Book])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
