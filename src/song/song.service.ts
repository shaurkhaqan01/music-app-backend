import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './entities/song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { LikeService } from 'src/like/like.service';
import { Like } from 'src/like/entities/like.entity';
import { Gender } from 'src/utils/enums';
import { User } from 'src/user/entities/user.entity';
const nodemailer = require("nodemailer");

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
    private readonly userService: UserService,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,


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
      },
      order:{
        likesCount:'DESC'
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
    const songs = await this.songRepository.find({ where: { artist: { id: artistId }}, order:{likesCount:'DESC'} });
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
  async getArtistStats(artistId: string): Promise<any> {
    let artist = await this.userService.findById(artistId);
    // Get songs and count likes
    const songs = await this.songRepository
      .createQueryBuilder('song')
      .leftJoinAndSelect('song.likes', 'like')
      .where('song.artistId = :artistId', { artistId })
      .getMany();

    if (!songs.length) {
      return { totalLikes: {totalLikes: 0,joiningDate: '2024'}, topCountries: [], topSongs: [], genderPercentage: { male: 0, female: 0 }, ageDistribution: { '12-16': 0, '17-25': 0, '25-35': 0 }
    }; // No songs found for artist
    }

   
    // Count likes by country and song
    const countryLikes = await this.userRepository
      .createQueryBuilder('user')
      .select('user.country, COUNT(like.id) AS likeCount')
      .innerJoin('user.likes', 'like')
      .where('like.songId IN (:...songIds)', { songIds: songs.map(song => song.id) })
      .groupBy('user.country')
      .getRawMany();

    const songLikes = await this.songRepository
      .createQueryBuilder('song')
      .select('song.id, song.title, COUNT(like.id) AS likeCount')
      .leftJoin('song.likes', 'like')
      .where('song.id IN (:...songIds)', { songIds: songs.map(song => song.id) })
      .groupBy('song.id')
      .getRawMany();

    // Process country likes
    const topCountries = countryLikes
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 5)
      .map(({ country, likeCount }) => ({ country, likesCount: Number(likeCount) }));

    // Process song likes
    const topSongs = songLikes
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 5)
      .map(({ id, title, likeCount }) => ({
        songName: title,
        likesCount: Number(likeCount),
      }));

    // Calculate gender percentages
    const genderCounts = await this.userRepository
      .createQueryBuilder('user')
      .select('user.gender, COUNT(like.id) AS likeCount')
      .innerJoin('user.likes', 'like')
      .where('like.songId IN (:...songIds)', { songIds: songs.map(song => song.id) })
      .groupBy('user.gender')
      .getRawMany();

    const maleCount = genderCounts.find(g => g.gender === Gender.MALE)?.likeCount || 0;
    const femaleCount = genderCounts.find(g => g.gender === Gender.FEMALE)?.likeCount || 0;
    const totalLikes = Number(maleCount) + Number(femaleCount);

    const malePercentage = totalLikes > 0 ? (maleCount / totalLikes) * 100 : 0;
    const femalePercentage = totalLikes > 0 ? (femaleCount / totalLikes) * 100 : 0;

    
    const genderPercentage = {
      male: malePercentage,
      female: femalePercentage,
    };


    // Calculate age distribution based on likes
    const ageCounts = await this.userRepository
      .createQueryBuilder('user')
      .select('user.dateOfBirth, COUNT(like.id) AS likeCount')
      .innerJoin('user.likes', 'like')
      .where('like.songId IN (:...songIds)', { songIds: songs.map(song => song.id) })
      .andWhere('user.dateOfBirth IS NOT NULL')
      .groupBy('user.dateOfBirth')
      .getRawMany();

    const totalLikesByAge = ageCounts.reduce((sum, { likeCount }) => sum + Number(likeCount), 0);
    
    // Initialize age distribution counts
    const ageDistribution = { age12to16: 0, age17to25: 0, age25to35: 0 };

    ageCounts.forEach(({ dateOfBirth, likeCount }) => {
      const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
      if (age >= 12 && age <= 16) {
        ageDistribution.age12to16 += Number(likeCount);
      } else if (age >= 17 && age <= 25) {
        ageDistribution.age17to25 += Number(likeCount);
      } else if (age >= 25 && age <= 35) {
        ageDistribution.age25to35 += Number(likeCount);
      }
    });

    // Calculate age percentage
    const agePercentage = {
      '12-15': totalLikesByAge > 0 ? (ageDistribution.age12to16 / totalLikesByAge) * 100 : 0,
      '17-25': totalLikesByAge > 0 ? (ageDistribution.age17to25 / totalLikesByAge) * 100 : 0,
      '25-35': totalLikesByAge > 0 ? (ageDistribution.age25to35 / totalLikesByAge) * 100 : 0,
    };
    let totalLikesOfArtist = {totalLikes: totalLikes, dateOfJoing: artist.createdAt}
    let data ={
      totalLikesOfArtist,
      topCountries,
      topSongs,
      genderPercentage,
      agePercentage

    };

    return {
      status: 'Success',
      data: {data:data},
      statusCode:200,
      message:'Succesfully'
    };
  }

  remove(id: number) {
    return `This action removes a #${id} song`;
  }

}
