import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { HealthController } from './health/health.controller';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AuthorsModule } from './authors/authors.module';
import { CategoriesModule } from './categories/categories.module';
import { BooksModule } from './books/books.module';
import { LoansModule } from './loans/loans.module';
import { User } from './users/models/user.model';
import { MemberProfile } from './profiles/models/member-profile.model';
import { Author } from './authors/models/author.model';
import { Category } from './categories/models/category.model';
import { Book } from './books/models/book.model';
import { BookAuthor } from './books/models/book-author.model';
import { Loan } from './loans/models/loan.model';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isTest = configService.get<string>('NODE_ENV') === 'test';

        if (isTest) {
          return {
            dialect: 'sqlite' as const,
            storage: ':memory:',
            autoLoadModels: true,
            synchronize: true,
            logging: false,
            models: [User, MemberProfile, Author, Category, Book, BookAuthor, Loan],
          };
        }

        return {
          dialect: 'mysql' as const,
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 3306),
          database: configService.get<string>('DB_NAME', 'library_db'),
          username: configService.get<string>('DB_USER', 'root'),
          password: configService.get<string>('DB_PASSWORD', 'Youssouf2000'),
          autoLoadModels: true,
          synchronize: configService.get<string>('DB_SYNC', 'true') === 'true',
          logging: console.log,
          retryAttempts: 10,
          retryDelay: 3000,
          models: [User, MemberProfile, Author, Category, Book, BookAuthor, Loan],
        };
      },
    }),
    UsersModule,
    ProfilesModule,
    AuthorsModule,
    CategoriesModule,
    BooksModule,
    LoansModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
