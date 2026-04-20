import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt } from 'class-validator';

export class CreateLoanDto {
  @ApiProperty({ example: '2026-04-20T10:00:00.000Z' })
  @IsDateString()
  dueDate: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  userId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  bookId: number;
}
