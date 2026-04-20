import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { MemberProfile } from './models/member-profile.model';
import { User } from '../users/models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([MemberProfile, User])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
