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

@Table({ tableName: 'member_profiles' })
export class MemberProfile extends Model {
  @ApiProperty()
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty()
  @Column({ type: DataType.STRING(180), allowNull: false })
  declare address: string;

  @ApiProperty()
  @Column({ type: DataType.STRING(30), allowNull: false })
  declare phone: string;

  @ApiProperty()
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  declare membershipNumber: string;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  declare joinedAt: Date;

  @ApiProperty()
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
  declare userId: number;

  @ApiProperty({ type: () => User })
  @BelongsTo(() => User)
  declare user: User;
}
