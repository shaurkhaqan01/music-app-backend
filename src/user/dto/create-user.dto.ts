import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly image: string;

    @ApiProperty()
    readonly email: string;

    @ApiProperty()
    readonly followersCount: number;


}
