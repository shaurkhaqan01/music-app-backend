import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FollowService } from './follow.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/decorators/isPublic';

@Controller('follow')
@ApiTags('Follow')
@ApiBearerAuth('Authorization')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Public()
  @Post(':followerId/:artistId')
  async follow(@Param('followerId') followerId: string, @Param('artistId') artistId: string) {
      return this.followService.followUser(followerId, artistId);
  }

  @Delete('unfollow/:followerId/:artistId')
  async unfollow(@Param('followerId') followerId: string, @Param('artistId') artistId: string) {
      return this.followService.unfollowUser(followerId, artistId);
  }

  @Public()
  @Get('artist/:artistId/followers')
  async getFollowers(@Param('artistId') artistId: string) {
      return this.followService.getFollowers(artistId);
  }

  @Public()
  @Get('check-follower/:artistId/followers/:followerId')
  async checkFollower(@Param('artistId') artistId: string,@Param('artistId') followerId: string) {
      return this.followService.checkFollower(artistId,followerId);
  }


  // @Get('user/:userId/following')
  // async getFollowing(@Param('userId') userId: string) {
  //     return this.followService.getFollowing(userId);
  // }
 
}
