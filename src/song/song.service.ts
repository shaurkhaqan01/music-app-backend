import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './entities/song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { LikeService } from 'src/like/like.service';
import { Like } from 'src/like/entities/like.entity';
const nodemailer = require("nodemailer");

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
    private readonly userService: UserService,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,

  ) {}

  async createSongAgainstArtist(
    artistId: string,
    createSongDto: CreateSongDto
  ) {
    let artist = await this.userService.findById(artistId);
    const song = new Song();
    song.title = createSongDto.title;
    song.artist = artist;
    song.attachment = createSongDto.attachment;
    
    let songObj =  await this.songRepository.save(
      song
    );
    return {
      status: 'Success',
      data: {data:songObj},
      statusCode:200,
      message:'Succesfully'
    };
  }

  async findAll() {
    return await this.songRepository.find();
  }
  async findAllOfArtist(artistId:string) {
    let songs = await this.songRepository.find({
      where:{
        artist:{
          id:artistId
        }
      }
    });
    return {
      status: 'Success',
      data: {data:songs},
      statusCode:200,
      message:'Succesfully'
    };
  }

  async findOne(id: string) {
    const song = await this.songRepository.findOne({
      where: {
        id,
      },
    });
    if (!song) {
      throw new UnprocessableEntityException({
        status: 'Fail',
        data: {},
        statusCode:422,
        message:'Song not found'
      },);
    }
    return {
      status: 'Success',
      data: {data:song},
      statusCode:200,
      message:'Succesfully'
    };
  }

  async update(id: string, updateSongDto: UpdateSongDto) {
    const song = await this.songRepository.findOne({
      where: {
        id,
      },
    });
    if (!song) {
      throw new UnprocessableEntityException({
        status: 'Fail',
        data: {},
        statusCode:422,
        message:'Song not found'
      });
    }
    const songObj = await this.songRepository.update(
      id,
      updateSongDto
    );
    if (!songObj) {
      throw new UnprocessableEntityException({
        status: 'Fail',
        data: {},
        statusCode:422,
        message:'Fail'
      });
    }
    let updated = await this.songRepository.findOne({where:{id:id}});
    
    return {
      status: 'Success',
      data: {data:updated},
      statusCode:200,
      message:'Succesfully'
    };
  }

  async getSongsForArtist(artistId: string, userId: string) {
    // Fetch songs by the artist
    const songs = await this.songRepository.find({ where: { artist: { id: artistId } } });
    // Check if the user has liked any of the songs
    const likedSongs =  await this.likeRepository.find({
      where: { user: { id: userId }, song: { artist: { id: artistId } } },
      relations: ['song'],
    });
    const likedSongIds = new Set(likedSongs.map(like => like.song.id));
    let songsArray =  songs.map(song => ({
        ...song,
        isLiked: likedSongIds.has(song.id),
    }));
    return {
      status: 'Success',
      data: {data:songsArray},
      statusCode:200,
      message:'Succesfully'
    };;
  }

  remove(id: number) {
    return `This action removes a #${id} song`;
  }

}
