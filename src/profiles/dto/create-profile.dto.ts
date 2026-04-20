import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: '12 rue des Fleurs, Paris' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  address: string;

  @ApiProperty({ example: '+33601020304' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phone: string;

  @ApiProperty({ example: 'MEM-2026-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  membershipNumber: string;

  @ApiProperty({ example: '2026-04-15T10:00:00.000Z' })
  @IsDateString()
  joinedAt: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  userId: number;
}
