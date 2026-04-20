import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/models/category.model';
import { Author } from '../../authors/models/author.model';
import { BookAuthor } from './book-author.model';
import { Loan } from '../../loans/models/loan.model';

@Table({ tableName: 'books' })
export class Book extends Model {
  @ApiProperty()
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty()
  @Column({ type: DataType.STRING(180), allowNull: false })
  declare title: string;

  @ApiProperty()
  @Column({ type: DataType.STRING(30), allowNull: false, unique: true })
  declare isbn: string;

  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare publishedYear: number;

  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  declare totalCopies: number;

  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  declare availableCopies: number;

  @ApiProperty({ required: false })
  @Column({ type: DataType.TEXT, allowNull: true })
  declare summary: string | null;

  @ApiProperty({ required: false })
  @Column({ type: DataType.STRING(500), allowNull: true })
  declare coverUrl: string | null;

  @ApiProperty()
  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare categoryId: number;

  @ApiProperty({ type: () => Category })
  @BelongsTo(() => Category)
  declare category: Category;

  @ApiProperty({ type: () => [Author] })
  @BelongsToMany(() => Author, () => BookAuthor)
  declare authors: Array<Author & { BookAuthor: BookAuthor }>;

  @ApiProperty({ type: () => [Loan] })
  @HasMany(() => Loan)
  declare loans: Loan[];
}
