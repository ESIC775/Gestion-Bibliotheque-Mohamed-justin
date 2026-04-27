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

@Table({ tableName: 'reservations' })
export class Reservation extends Model {
  @ApiProperty()
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  declare reservedAt: Date;

  @ApiProperty({ example: 'PENDING', description: 'Statut: PENDING, CANCELLED, COMPLETED' })
  @Column({
    type: DataType.ENUM('PENDING', 'CANCELLED', 'COMPLETED'),
    defaultValue: 'PENDING',
    allowNull: false,
  })
  declare status: string;

  @ApiProperty()
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;

  @ApiProperty()
  @ForeignKey(() => Book)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare bookId: number;

  @BelongsTo(() => Book)
  declare book: Book;
}
