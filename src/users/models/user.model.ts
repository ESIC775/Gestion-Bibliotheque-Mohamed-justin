import {
  Table,
  Model,
  Column,
  DataType,
  HasOne,
  HasMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { MemberProfile } from '../../profiles/models/member-profile.model';
import { Loan } from '../../loans/models/loan.model';
import { Reservation } from '../../reservations/models/reservation.model';

@Table({ tableName: 'users' })
export class User extends Model {
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

  @ApiProperty()
  @Column({ type: DataType.STRING(150), allowNull: false, unique: true })
  declare email: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @ApiProperty({ type: () => MemberProfile })
  @HasOne(() => MemberProfile)
  declare profile: MemberProfile;

  @ApiProperty({ type: () => [Loan] })
  @HasMany(() => Loan)
  declare loans: Loan[];

  @ApiProperty({ type: () => [Reservation] })
  @HasMany(() => Reservation)
  declare reservations: Reservation[];
}
