import {
  Table,
  Model,
  Column,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Book } from '../../books/models/book.model';

@Table({ tableName: 'categories' })
export class Category extends Model {
  @ApiProperty()
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty()
  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  declare name: string;

  @ApiProperty({ required: false })
  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @ApiProperty({ type: () => [Book] })
  @HasMany(() => Book)
  declare books: Book[];
}
