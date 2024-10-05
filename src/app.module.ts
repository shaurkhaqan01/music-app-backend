import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { databaseProvider } from './utils/connectionOptions';
import { APP_GUARD } from '@nestjs/core';
import { JWTGuard } from './guards/jwt.guard';
import { SongModule } from './song/song.module';
// import { AttachmentModule } from './attachment/attachment.module';
import { FollowModule } from './follow/follow.module';
import { LikeModule } from './like/like.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseProvider),
    ConfigModule.forRoot({ isGlobal: true }),
    // ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    SongModule,
    FollowModule,
    LikeModule,
    // AttachmentModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JWTGuard,
    },
  ],
})
export class AppModule {}
