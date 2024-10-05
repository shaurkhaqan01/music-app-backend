import { ApiProperty } from "@nestjs/swagger";

export class CreateSongDto {

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly duration: string;

  @ApiProperty()
  readonly likesCount: number;

  @ApiProperty()
  readonly attachment: string;
}
