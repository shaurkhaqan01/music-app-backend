import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { Like } from './entities/like.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { SongService } from 'src/song/song.service';

@Injectable()
export class LikeService {

  constructor(
    @InjectRepository(Like)
      private likeRepository: Repository<Like>,
      private readonly userService: UserService,
      private readonly songService: SongService,

      
  ) {}

  async likeSong(userId: string, songId: string) {
    let alreadyExist = await this.likeRepository.findOne({where:{user:{id:userId, song:{id:songId}}}});
    if(alreadyExist){
      throw new BadRequestException('Already liked');
    }else{
      const user = await this.userService.findOne(userId);
      const song = await this.songService.findOne(songId);
  
      if (!user || !song) {
          throw new NotFoundException('User or song not found');
      }
  
      const like = this.likeRepository.create({ user, song });
      await this.likeRepository.save(like);
  
      // Update the likes count on the song
      song.likesCount++;
      await this.songService.update(song.id,{likesCount:song.likesCount});
  
      return like;
    }
    
  }

  async findLikedSongs(userId:string, artistId:string){
    return await this.likeRepository.find({
      where: { user: { id: userId }, song: { artist: { id: artistId } } },
      relations: ['song'],
    });
  }
  

  create(createLikeDto: CreateLikeDto) {
    return 'This action adds a new like';
  }

  findAll() {
    return `This action returns all like`;
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  update(id: number, updateLikeDto: UpdateLikeDto) {
    return `This action updates a #${id} like`;
  }

  remove(id: number) {
    return `This action removes a #${id} like`;
  }
}
