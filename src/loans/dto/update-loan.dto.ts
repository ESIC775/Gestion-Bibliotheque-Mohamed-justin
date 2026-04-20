import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDateString, IsIn, IsOptional } from 'class-validator';
import { CreateLoanDto } from './create-loan.dto';

export class UpdateLoanDto extends PartialType(CreateLoanDto) {
  @ApiProperty({ required: false, example: '2026-04-18T14:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  returnedAt?: string;

  @ApiProperty({ required: false, example: 'RETURNED', enum: ['BORROWED', 'RETURNED'] })
  @IsOptional()
  @IsIn(['BORROWED', 'RETURNED'])
  status?: 'BORROWED' | 'RETURNED';
}
