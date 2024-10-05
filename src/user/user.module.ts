import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { OPTIONS } from 'src/utils/jwtOptions';
import { RefreshTokenService } from 'src/auth/refreshToken.service';
import { RefreshToken } from 'src/auth/entities/refreshToken.entity';
import { FollowModule } from 'src/follow/follow.module';

@Module({
  imports: [TypeOrmModule.forFeature([User,RefreshToken]),FollowModule,
  JwtModule.register(OPTIONS),
],
  controllers: [UserController],
  providers: [UserService,RefreshTokenService],
  exports: [UserService],
})
export class UserModule {}
