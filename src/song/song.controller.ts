import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { SongService } from './song.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { ApiTags, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JWTGuard } from 'src/guards/jwt.guard';
import { Public } from 'src/decorators/isPublic';


@ApiTags('Song')
@ApiBearerAuth('Authorization')
@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  // @Public()
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //       link: {
  //         type: 'string',
  //       },
  //     },
  //   },
  // })
  // @ApiConsumes('multipart/form-data')
  // @UseGuards(JWTGuard)
  // @UseInterceptors(FileInterceptor('file'))
  // @Post()
  // createPost(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() createExpenseClaimDto: CreatePostDto
  // ) {
  //   return this.postService.create(
  //     file,
  //     createExpenseClaimDto
  //   );
  // }

  @Public()
  @Post('add-song/:artistId')
  create(@Param('artistId') artistId: string,@Body() createSongDto: CreateSongDto) {
    return this.songService.createSongAgainstArtist(artistId,createSongDto);
  }


  @Public()
  @Get('all-songs/:artistId')
  findAll(@Param('artistId') artistId: string) {
    return this.songService.findAllOfArtist(artistId);
  }
  @Public()

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songService.findOne(id);
  }

  @Public()

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto) {
    return this.songService.update(id, updateSongDto);
  }
  @Public()

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.songService.remove(+id);
  }

  @Get(':artistId/songs')
  async getSongs(@Param('artistId') artistId: string, @Req() req) {
      const userId = req.user.id; // Assuming user ID is stored in the request after authentication
      return this.songService.getSongsForArtist(artistId, userId);
  }
}
