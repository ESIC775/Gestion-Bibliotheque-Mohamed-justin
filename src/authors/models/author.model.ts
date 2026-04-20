import {
  Table,
  Model,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Book } from '../../books/models/book.model';
import { BookAuthor } from '../../books/models/book-author.model';

@Table({ tableName: 'authors' })
export class Author extends Model {
  @ApiProperty()
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty()
  @Column({ type: DataType.STRING(100), allowNull: false })
  declare firstName: string;

  @ApiProperty()
  @Column({ type: DataType.STRING(100), allowNull: false })
  declare lastName: string;

  @ApiProperty({ required: false })
  @Column({ type: DataType.TEXT, allowNull: true })
  declare bio: string | null;

  @ApiProperty({ type: () => [Book] })
  @BelongsToMany(() => Book, () => BookAuthor)
  declare books: Array<Book & { BookAuthor: BookAuthor }>;
}
