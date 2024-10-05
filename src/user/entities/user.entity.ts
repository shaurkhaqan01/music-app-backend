
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Song } from 'src/song/entities/song.entity';
import { Gender, UserType } from 'src/utils/enums';
import { Follow } from 'src/follow/entities/follow.entity';
import { Like } from 'src/like/entities/like.entity';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ unique: false })
  email: string;

  @ApiProperty()
  @Column({ unique: false })
  name: string;

  @ApiProperty()
  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateOfBirth: Date;

  @ApiProperty()
  @Column({ unique: false,nullable: true  })
  country: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: Gender,
    enumName: 'GenderEnum',
  })
  gender: Gender;

  @ApiHideProperty()
  @Column({ nullable: true })
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({ default: null, nullable: true })
  profilePicture: string;

  @Column({ default: false })
  isDeleted: boolean;
  
  @Exclude()
  @ApiHideProperty()
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: UserType,
    enumName: 'UserTypeEnum',
  })
  userType: UserType;

  @ApiProperty()
  @Column({ default:0 })
  followersCount: number;

  @Exclude()
  @ApiHideProperty()
  @Column({ default: null, nullable: true })
  resetToken: string;

  @Exclude()
  @ApiHideProperty()
  @Column({ default: null, nullable: true })
  resetTokenExpiry: Date;

  @Exclude()
  @ApiHideProperty()
  @Column({ default: null, nullable: true })
  secretToken: string;

  @Exclude()
  @ApiHideProperty()
  @Column({ default: null, nullable: true })
  secretKey: string;

  @Exclude()
  @ApiHideProperty()
  @Column({ default: null, nullable: true })
  uniqueKey: string;

  @Exclude()
  @ApiHideProperty()
  @Column({ type: 'timestamp', nullable: true })
  secretTokenCreatedAt: Date;

  @ApiProperty()
  @Exclude()
  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  passwordUpdatedAt: Date;

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @ApiProperty({ type: () => [Song] })
  @OneToMany(() => Song, (song) => song.artist)
  song: Song[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.artist)
  followers: Follow[];

  @OneToMany(() => Like, (like) => like.user)
    likes: Like[];

}

