import {
  Table,
  Model,
  Column,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { Book } from './book.model';
import { Author } from '../../authors/models/author.model';

@Table({ tableName: 'book_authors', timestamps: false })
export class BookAuthor extends Model {
  @ForeignKey(() => Book)
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true })
  declare bookId: number;

  @ForeignKey(() => Author)
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true })
  declare authorId: number;
}
