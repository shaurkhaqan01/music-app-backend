import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/isPublic';
import { RegisterArtistRequest, RegisterUserRequest } from 'src/auth/dto/create-auth.dto';

@ApiBearerAuth('Authorization')
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register-artist')
  registerArtist(@Body() createUserDto: RegisterArtistRequest) {
    return this.userService.createArtist(createUserDto);
  }

  @Public()
  @Post('register-user')
  registerUser(@Body() createUserDto: RegisterUserRequest) {
    return this.userService.createUser(createUserDto);
  }

  @Get('list-of-artist',)
  findAll( @Req() req:any) {
    return this.userService.findAllArtist(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('follow-artist/:artistId')
  followArtist(@Param('artistId') artistId: string) {
    return this.userService.followerCount(artistId);
  }

//   @Get('resend-email/:id')
//   resendEmail(@Param('id') id: string) {
//     return this.userService.resendVerificationEmail(id);
//   }

}
