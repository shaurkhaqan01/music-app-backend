import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { Song } from './entities/song.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { LikeService } from 'src/like/like.service';
import { Like } from 'src/like/entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song,Like]),UserModule],
  controllers: [SongController],
  providers: [SongService,LikeService],
  exports: [SongService],

})
export class SongModule {}

