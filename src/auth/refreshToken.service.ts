import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refreshToken.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshToken: Repository<RefreshToken>,
  ) {}

  async createRefreshToken(user: User, ttl: number): Promise<RefreshToken> {
    const refreshToken = new RefreshToken();
    refreshToken.user = user;
    refreshToken.isRevoked = false;
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + ttl);
    refreshToken.tokenExpiry = expiration;
    return await this.refreshToken.save(refreshToken);
  }

  async findTokenById(id: string) {
    return await this.refreshToken.findOne({
      where: {
        id,
        isRevoked: false,
      },
      relations: ['user'],
    });
  }
}
