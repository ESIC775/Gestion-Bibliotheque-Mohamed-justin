import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ example: 4, description: "ID de l'utilisateur qui réserve" })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 1, description: "ID du livre à réserver" })
  @IsInt()
  @IsNotEmpty()
  bookId: number;
}
