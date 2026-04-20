import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({ example: 'Victor' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Hugo' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ example: 'Écrivain français majeur du XIXe siècle.', required: false })
  @IsOptional()
  @IsString()
  bio?: string;
}
