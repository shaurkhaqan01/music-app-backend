import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { Like } from './entities/like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { SongModule } from 'src/song/song.module';

@Module({
  imports: [TypeOrmModule.forFeature([Like]),UserModule, SongModule],
  controllers: [LikeController],
  providers: [LikeService],
  exports:[LikeService]
})
export class LikeModule {}
