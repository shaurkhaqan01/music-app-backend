import { ApiProperty } from "@nestjs/swagger";
import { Song } from "src/song/entities/song.entity";
import { User } from "src/user/entities/user.entity";
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Entity } from "typeorm";
@Entity('like')
export class Like {

    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string; 

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

    @ManyToOne(() => User, (user) => user.likes)
    user: User;

    @ManyToOne(() => Song, (song) => song.likes)
    song: Song;

}
