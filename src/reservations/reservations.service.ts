import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Reservation } from './models/reservation.model';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Book } from '../books/models/book.model';
import { User } from '../users/models/user.model';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation)
    private readonly reservationModel: typeof Reservation,
    @InjectModel(Book)
    private readonly bookModel: typeof Book,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    const { userId, bookId } = createReservationDto;

    const user = await this.userModel.findByPk(userId);
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const book = await this.bookModel.findByPk(bookId);
    if (!book) throw new NotFoundException('Livre introuvable');

    return this.reservationModel.create({
      userId,
      bookId,
      reservedAt: new Date(),
      status: 'PENDING',
    } as any);
  }

  async findAll() {
    return this.reservationModel.findAll({
      include: [
        { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Book, attributes: ['id', 'title', 'isbn'] },
      ],
    });
  }

  async findOne(id: number) {
    const reservation = await this.reservationModel.findByPk(id, {
      include: [User, Book],
    });
    if (!reservation) throw new NotFoundException('Réservation introuvable');
    return reservation;
  }

  async cancel(id: number) {
    const reservation = await this.findOne(id);
    await reservation.update({ status: 'CANCELLED' });
    return { message: 'Réservation annulée avec succès' };
  }

  async remove(id: number) {
    const reservation = await this.findOne(id);
    await reservation.destroy();
    return { message: 'Réservation supprimée définitivement' };
  }
}
