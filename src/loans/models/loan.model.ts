import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/models/user.model';
import { Book } from '../../books/models/book.model';

@Table({ tableName: 'loans' })
export class Loan extends Model {
  @ApiProperty()
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  declare borrowedAt: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
  declare dueDate: Date;

  @ApiProperty({ required: false, nullable: true })
  @Column({ type: DataType.DATE, allowNull: true })
  declare returnedAt: Date | null;

  @ApiProperty({ example: 'BORROWED' })
  @Column({
    type: DataType.ENUM('BORROWED', 'RETURNED'),
    allowNull: false,
    defaultValue: 'BORROWED',
  })
  declare status: 'BORROWED' | 'RETURNED';

  @ApiProperty()
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @ApiProperty()
  @ForeignKey(() => Book)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare bookId: number;

  @ApiProperty({ type: () => User })
  @BelongsTo(() => User)
  declare user: User;

  @ApiProperty({ type: () => Book })
  @BelongsTo(() => Book)
  declare book: Book;
}
