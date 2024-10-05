import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('like')
@ApiTags('Like')
@ApiBearerAuth('Authorization')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}


  @Post(':userId/:songId')
  async like(@Param('userId') userId: string, @Param('songId') songId: string) {
      return this.likeService.likeSong(userId, songId);
  }

  // @Post()
  // create(@Body() createLikeDto: CreateLikeDto) {
  //   return this.likeService.create(createLikeDto);
  // }

  // @Get()
  // findAll() {
  //   return this.likeService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.likeService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLikeDto: UpdateLikeDto) {
  //   return this.likeService.update(+id, updateLikeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.likeService.remove(+id);
  // }
}
