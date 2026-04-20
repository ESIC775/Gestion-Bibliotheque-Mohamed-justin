import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MemberProfile } from '../profiles/models/member-profile.model';
import { Loan } from '../loans/models/loan.model';
import { Book } from '../books/models/book.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(MemberProfile) private readonly profileModel: typeof MemberProfile,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      password: '$2b$10$61EQfLnhq9TYPcM14CI9j.qX0x4t24QPu1ekwat6Og..xT.nDaI1G', // 'mohamed123' par défaut
    });

    const membershipNumber = `MEM-2026-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    await this.profileModel.create({
      address: createUserDto.address,
      phone: createUserDto.phone,
      membershipNumber,
      userId: user.id,
    });

    return this.findOne(user.id);
  }

  findAll() {
    return this.userModel.findAll({
      include: [
        { model: MemberProfile },
        { model: Loan, include: [Book] },
      ],
      order: [['id', 'ASC']],
    });
  }

  async findOne(id: number) {
    const user = await this.userModel.findByPk(id, {
      include: [
        { model: MemberProfile },
        { model: Loan, include: [Book] },
      ],
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur ${id} introuvable.`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    
    await user.update({
      firstName: updateUserDto.firstName ?? user.firstName,
      lastName: updateUserDto.lastName ?? user.lastName,
      email: updateUserDto.email ?? user.email,
    });

    if (updateUserDto.address || updateUserDto.phone) {
      if (user.profile) {
        await user.profile.update({
          address: updateUserDto.address ?? user.profile.address,
          phone: updateUserDto.phone ?? user.profile.phone,
        });
      } else {
        await this.profileModel.create({
          address: updateUserDto.address ?? 'À renseigner',
          phone: updateUserDto.phone ?? 'À renseigner',
          membershipNumber: `MEM-2026-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          userId: user.id,
        });
      }
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await user.destroy();
    return { message: `Utilisateur ${id} supprimé avec succès.` };
  }
}
