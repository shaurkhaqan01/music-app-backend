import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();
const JWT_SECRET = process.env.JWT_TOKEN_SECRET;
const JWT_EXPIRY = process.env.ACCESS_TOKEN_EXPIRATION;
const JWT_REFRESH_EXPIRY = process.env.REFRESH_TOKEN_EXPIRATION;

const BASE_OPTIONS: JwtSignOptions = {
  issuer: 'https://art.com',
  audience: 'https://art.com',
};

interface RefreshTokenPayload {
  jti: string;
  sub: string;
}

const OPTIONS: JwtModuleOptions = {
  secret: JWT_SECRET,
  signOptions: {
    expiresIn: JWT_EXPIRY,
  },
};

export {
  BASE_OPTIONS,
  OPTIONS,
  JWT_SECRET,
  JWT_EXPIRY,
  JWT_REFRESH_EXPIRY,
  RefreshTokenPayload,
};
