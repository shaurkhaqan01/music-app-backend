import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";
import { Gender, UserType } from "src/utils/enums";
export class CreateAuthDto {}

export class RegisterArtistRequest {

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'An email is required' })
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'A password is required' })
  @MinLength(6, { message: 'Your password must be at least 6 characters' })
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'An type is required' })
  readonly userType: UserType;
   
}
export class RegisterUserRequest {

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'An email is required' })
  readonly email: string;

  @ApiProperty()
  readonly dateOfBirth: Date;

  @ApiProperty()
  readonly country: string;

  @ApiProperty()
  readonly gender: Gender;

  @ApiProperty()
  @IsNotEmpty({ message: 'A password is required' })
  @MinLength(6, { message: 'Your password must be at least 6 characters' })
  readonly password: string;
  
  @ApiProperty()
  @IsNotEmpty({ message: 'An type is required' })
  readonly userType: UserType;
}
