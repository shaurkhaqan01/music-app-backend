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
      throw new BadRequestException({
        status: 'Fail',
        data: {},
        statusCode:400,
        message:'Alread Exists'
      })
    }else{
      const follower = await this.userRepository.findOne({where:{id:followerId}});
      const artist = await this.userRepository.findOne({where:{id:artistId}});
  
      if (!follower || !artist) {
          throw new NotFoundException({
            status: 'Fail',
            data: {},
            statusCode:404,
            message:'Follower or artist not found'
          });
      }
      const follow = this.followRepository.create({ follower, artist });
      artist.followersCount++;
      await this.userRepository.update(artist.id,{followersCount:artist.followersCount});

      let followObj = await this.followRepository.save(follow);
      return {
        status: 'Success',
        data: {data:followObj},
        statusCode:200,
        message:'Successful'
      };
    }
        
  }

  async unfollowUser(followerId: string, artistId: string) {
      const follow = await this.followRepository.findOne({
          where: { follower: { id: followerId }, artist: { id: artistId } },
      });

      if (!follow) {
          throw new NotFoundException({
            status: 'Fail',
            data: {},
            statusCode:404,
            message:'Follower or artist not found'
          });
      }
      const artist = await this.userRepository.findOne({where:{id:artistId}});
      artist.followersCount--;
      await this.userRepository.update(artist.id,{followersCount:artist.followersCount});
      const deleted = await this.followRepository.remove(follow);
      return {
        status: 'Success',
        data: {data:deleted},
        statusCode:200,
        message:'Successful'
      };
  }

  async getFollowers(artistId: string) {
      let count = await this.followRepository.count({ where: { artist: { id: artistId } } });
      return {
        status: 'Success',
        data: {data:count},
        statusCode:200,
        message:'Successful'
      };
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
    if(follow){
      return follow
    }
  }

  // async getFollowing(userId: string) {
  //     return this.followRepository.find({ where: { follower: { id: userId } } });
  // }
  
}
