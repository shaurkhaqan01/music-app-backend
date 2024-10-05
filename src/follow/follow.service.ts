import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
      private followRepository: Repository<Follow>,
      @InjectRepository(User)
      private userRepository: Repository<User>,
  ) {}
  async followUser(followerId: string, artistId: string) {
    let alreadyFollowed = await this.followRepository.findOne({
      where:{
        follower:{id:followerId},
        artist:{id:artistId}
      }
    });
    if(alreadyFollowed){
      throw new BadRequestException('Alread Exists')
    }else{
      const follower = await this.userRepository.findOne({where:{id:followerId}});
      const artist = await this.userRepository.findOne({where:{id:artistId}});
  
      if (!follower || !artist) {
          throw new NotFoundException('Follower or artist not found');
      }
      const follow = this.followRepository.create({ follower, artist });
      artist.followersCount++;
      await this.userRepository.update(artist.id,{followersCount:artist.followersCount});

      return this.followRepository.save(follow);
    }
        
  }

  async unfollowUser(followerId: string, artistId: string) {
      const follow = await this.followRepository.findOne({
          where: { follower: { id: followerId }, artist: { id: artistId } },
      });

      if (!follow) {
          throw new NotFoundException('Follow relationship not found');
      }

      return this.followRepository.remove(follow);
  }

  async getFollowers(artistId: string) {
      return this.followRepository.count({ where: { artist: { id: artistId } } });
  }

  async checkFollower(artistId: string,followerId:string) {
    let alreadyFollowed = await this.followRepository.findOne({
      where:{
        follower:{id:followerId},
        artist:{id:artistId}
      }
    });
    if(alreadyFollowed){
      return true
    }else{
      false
    }
  }
  async isFollow(artistId: string,followerId:string) {
    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, artist: { id: artistId } },
    });
    return follow
  }

  // async getFollowing(userId: string) {
  //     return this.followRepository.find({ where: { follower: { id: userId } } });
  // }
  
}
