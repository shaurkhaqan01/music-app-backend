import { UserModule } from './../user/user.module';
import { User } from 'src/user/entities/user.entity';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OPTIONS } from 'src/utils/jwtOptions';
import { RefreshToken } from './entities/refreshToken.entity';
import { RefreshTokenService } from './refreshToken.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JWTGuard } from 'src/guards/jwt.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    PassportModule,
    JwtModule.register(OPTIONS),
    UserModule,
   
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenService, JwtStrategy, JWTGuard ],
})
export class AuthModule {}
