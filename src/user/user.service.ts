/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterArtistRequest, RegisterUserRequest } from 'src/auth/dto/create-auth.dto';
import { randomStr } from 'src/utils/utilities';
import { UserType } from 'src/utils/enums';
import { AuthService } from 'src/auth/auth.service';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { BASE_OPTIONS, JWT_EXPIRY, JWT_REFRESH_EXPIRY, RefreshTokenPayload } from 'src/utils/jwtOptions';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from 'src/auth/refreshToken.service';
import { FollowService } from 'src/follow/follow.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly followService: FollowService,


//     private readonly companyUserMapperService: CompanyUserMapperService,

  ) {
//     this.emailService = SESEmailService.getInstance();
  }
  async createArtist(createUserDto: RegisterArtistRequest) {
    const foundUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    let user;
    if (foundUser) {
      throw new UnprocessableEntityException('This email is already in use.');
    }else{
      user = new User();
    }
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.userType = createUserDto.userType;
    user.secretToken = randomStr();
    user.secretTokenCreatedAt = new Date();
    user.isVerified = true;
    user.password = await bcrypt.hashSync(createUserDto.password, 10);
    this.validateUser(user);
    const createdUser = await this.userRepository.save(user);
    if (!createdUser) {
      throw new UnprocessableEntityException(
        'Unable to create user. Please try again.'
      );
    }
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    delete user.password;
    delete user.secretToken;
    delete user.secretToken;
    delete user.secretTokenCreatedAt;
    delete user.passwordUpdatedAt;
    delete user.secretToken;
    const payload = {
      ...this.buildResponsePayload(user, accessToken, refreshToken),

    };
    return {
      status: 'success',
      data: payload,
    };
  }
  async createUser(createUserDto: RegisterUserRequest) {
    const foundUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    let user;
    if (foundUser) {
      throw new UnprocessableEntityException('This phone number is already in use.');
    }else{
      user = new User();
    }
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.dateOfBirth = createUserDto.dateOfBirth;
    user.country = createUserDto.country;
    user.gender = createUserDto.gender;
    user.secretToken = randomStr();
    user.secretTokenCreatedAt = new Date();
    user.isVerified = true;
    user.userType = createUserDto.userType;
    user.password = await bcrypt.hashSync(createUserDto.password, 10);
    this.validateUser(user);
    const createdUser = await this.userRepository.save(user);
    if (!createdUser) {
      throw new UnprocessableEntityException(
        'Unable to create user. Please try again.'
      );
    }
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    delete user.password;
    delete user.secretToken;
    delete user.secretToken;
    delete user.secretTokenCreatedAt;
    delete user.passwordUpdatedAt;
    delete user.secretToken;
    const payload = {
      ...this.buildResponsePayload(user, accessToken, refreshToken),

    };
    return {
      status: 'success',
      data: payload,
    };
  }



  async findAllArtist(userId:string) {
    let artists = await this.userRepository.find({
      where: {
        isDeleted: false,
        isVerified:true,
        userType:UserType.ARTIST
      },
    });
    // Create a list to hold artist songs, liked status, and follow status
    const artistWithFollowStatus = await Promise.all(artists.map(async (artist) => {
     
      // Check if the user follows this artist
      const follow = await this.followService.isFollow(artist.id,userId)

      const isFollowing = !!follow;
     
      return {
          artist,
          isFollowing,
      };
  }));

  return artistWithFollowStatus;
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return user;
  }

  async findBySecretToken(secretToken: string) {
    const user = await this.userRepository.findOne({
      where: {
        secretToken: secretToken,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return user;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async followerCount(artistId: string) {
    let user = await this.userRepository.findOne({
      where:{
        id:artistId
      }
    });
    if(user){
      await this.userRepository.update(artistId, {followersCount:user.followersCount + 1});
      return this.userRepository.findOne({where:{id:artistId}});
    }else{
      throw new BadRequestException('User not found');
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
        isDeleted: false,
      },
    });
    if (user) {
      return user;
    } else {
      throw new BadRequestException('Invalid credentials.');
    }
  }

  async findUserBySecretKey(secretKey: string) {
    return await this.userRepository.findOne({
      where: {
        secretKey,
        isDeleted: false,
      },
    });
  }

  async validateCredentials(user: User, password: string) {
    return await bcrypt.compare(password, user.password);
  }

  async findUserByToken(token: string) {
    const user = await this.userRepository.findOne({
      where: {
        secretToken: token,
      },
    });
    if (!user) {
      throw new UnprocessableEntityException('Invalid one time pin');
    }
    delete user.password;
    delete user.secretToken;
    delete user.secretToken;
    delete user.secretTokenCreatedAt;
    delete user.passwordUpdatedAt;
    delete user.secretToken;
  
    return user;
  }

  async updatePassword(id: string, password: string) {
    this.checkPassword(password);
    const hashedPassword = await this.createHash(password);
    return await this.userRepository.update(id, {
      password: hashedPassword,
    });
  }

  async setPassword(user: User, password: string, oldPassword: string) {
    this.checkPassword(password);
    const checkOldPassword = await this.validateCredentials(user, oldPassword);
    if (checkOldPassword == true) {
      const hashedPassword = await this.createHash(password);
      return await this.userRepository.update(user.id, {
        password: hashedPassword,
      });
    } else {
      throw new UnprocessableEntityException('Old Password is incorrect.');
    }
  }

  async resetPassword(user: User, password: string) {
    this.checkPassword(password);
    const hashedPassword = await this.createHash(password);
    return await this.userRepository.update(user.id, {
      password: hashedPassword,
    });
  }

  private checkPassword(password: string) {
    if (!password) {
      throw new UnprocessableEntityException('Password is required.');
    }
    // if (
    //   password.length < 6 &&
    //   !/^(?=.*[0-9])(?=.*[A-Za-z])[\w\W]{6,16}$/.test(password)
    // ) {
    //   throw new UnprocessableEntityException(
    //     'Password should be more than 6 characters and should have letters and numbers.',
    //   );
    // }
  }
  private async createHash(password: string) {
    return await bcrypt.hashSync(password, 10);
  }



  validateUser(user: User) {
   
    if (!user.email) {
      throw new UnprocessableEntityException('Email is required.');
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email)) {
      throw new UnprocessableEntityException(
        'A valid email address is required.'
      );
    }
    this.checkPassword(user.password);
  }
  buildResponsePayload(user: User, accessToken: string, refreshToken?: string) {
    return {
      user: user,
      payload: {
        type: 'bearer',
        token: accessToken,
        ...(refreshToken ? { refresh_token: refreshToken } : {}),
      },
    };
  }
  public async generateAccessToken(user: User): Promise<string> {
    const opts: SignOptions = {
      ...BASE_OPTIONS,
      subject: String(user.id),
      expiresIn: JWT_EXPIRY,
    };

    return this.jwtService.signAsync({}, opts);
  }
  public async generateRefreshToken(user: User): Promise<string> {
    const token = await this.refreshTokenService.createRefreshToken(
      user,
      31556926,
    );
    const opts: SignOptions = {
      ...BASE_OPTIONS,
      expiresIn: JWT_REFRESH_EXPIRY,
      subject: String(user.id),
      jwtid: String(token.id),
    };
    return this.jwtService.signAsync({}, opts);
  }
}