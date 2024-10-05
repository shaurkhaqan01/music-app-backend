import { ApiProperty } from "@nestjs/swagger";
import { User, } from "src/user/entities/user.entity";
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Entity } from "typeorm";

@Entity('follow')
export class Follow {

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

    @ApiProperty({ type: () => User })
    @ManyToOne(() => User, (user) => user.id)
    artist: User;

    @ApiProperty({ type: () => User })
    @ManyToOne(() => User, (user) => user.id)
    follower: User;

}
