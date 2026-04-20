import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MemberProfile } from './models/member-profile.model';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '../users/models/user.model';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(MemberProfile)
    private readonly profileModel: typeof MemberProfile,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    const user = await this.userModel.findByPk(createProfileDto.userId);

    if (!user) {
      throw new NotFoundException(
        `Impossible de créer le profil : utilisateur ${createProfileDto.userId} introuvable.`,
      );
    }

    return this.profileModel.create({
      ...createProfileDto,
      joinedAt: new Date(createProfileDto.joinedAt),
    });
  }

  findAll() {
    return this.profileModel.findAll({ include: [User], order: [['id', 'ASC']] });
  }

  async findOne(id: number) {
    const profile = await this.profileModel.findByPk(id, { include: [User] });

    if (!profile) {
      throw new NotFoundException(`Profil ${id} introuvable.`);
    }

    return profile;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.findOne(id);

    if (updateProfileDto.userId) {
      const user = await this.userModel.findByPk(updateProfileDto.userId);
      if (!user) {
        throw new NotFoundException(
          `Impossible de rattacher le profil : utilisateur ${updateProfileDto.userId} introuvable.`,
        );
      }
    }

    return profile.update({
      ...updateProfileDto,
      joinedAt: updateProfileDto.joinedAt
        ? new Date(updateProfileDto.joinedAt)
        : profile.joinedAt,
    });
  }

  async remove(id: number) {
    const profile = await this.findOne(id);
    await profile.destroy();
    return { message: `Profil ${id} supprimé avec succès.` };
  }
}
