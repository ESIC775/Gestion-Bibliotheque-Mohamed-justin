import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/models/user.model';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: 'secret_key_2026', // Clé fixe comme convenu
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
