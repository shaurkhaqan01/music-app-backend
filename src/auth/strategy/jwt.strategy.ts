import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JWT_EXPIRY, JWT_SECRET } from 'src/utils/jwtOptions';
import { AccessTokenPayload } from 'src/utils/payloads';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
      signOptions: {
        expiresIn: JWT_EXPIRY,
      },
    });
  }
  async validate(payload: AccessTokenPayload): Promise<User> {
    const { sub: id } = payload;

    const user =await this.userService.findOne(id);

    if (!user) {
      return null;
    }
    return user.data.data;
  }
}
