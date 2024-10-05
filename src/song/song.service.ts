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
    return await this.songRepository.save(
      song
    );
  }

  async findAll() {
    return await this.songRepository.find();
  }
  async findAllOfArtist(artistId:string) {
    return await this.songRepository.find({
      where:{
        artist:{
          id:artistId
        }
      }
    });
  }

  async findOne(id: string) {
    const song = await this.songRepository.findOne({
      where: {
        id,
      },
    });
    if (!song) {
      throw new UnprocessableEntityException('Song not found');
    }
    return song;
  }

  async update(id: string, updateSongDto: UpdateSongDto) {
    const song = await this.songRepository.findOne({
      where: {
        id,
      },
    });
    if (!song) {
      throw new UnprocessableEntityException('LeaveCateogy not found');
    }
    const songObj = await this.songRepository.update(
      id,
      updateSongDto
    );
    if (!songObj) {
      throw new UnprocessableEntityException(songObj);
    }
    return songObj;
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
    return songs.map(song => ({
        ...song,
        isLiked: likedSongIds.has(song.id),
    }));
  }

  remove(id: number) {
    return `This action removes a #${id} song`;
  }

}
