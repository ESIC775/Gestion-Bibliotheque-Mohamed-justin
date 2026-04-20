import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'mohamed@gmail.com', description: 'Adresse email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'mohamed123',
    description: 'Mot de passe (minimum 6 caractères)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
