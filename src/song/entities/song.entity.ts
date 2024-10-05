import { ApiProperty } from '@nestjs/swagger';
import { Like } from 'src/like/entities/like.entity';
import { User } from 'src/user/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Entity,
  OneToMany,
} from 'typeorm';

@Entity('song')
export class Song {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  duration: string;

  @ApiProperty()
  @Column({default:0})
  likesCount: number;

  @ApiProperty()
  @Column()
  attachment: string;

  @ApiProperty()
  @Column({ default: false})
  isDeleted: boolean;

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

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.id)
  artist: User;

  @OneToMany(() => Like, (like) => like.song)
  likes: Like[];

}
