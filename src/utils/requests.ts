
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class LoginRequest {
  @ApiProperty()
  @IsNotEmpty({ message: 'An email is required' })
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'A password is required to login' })
  readonly password: string;
}


export class ForgetPasswordEmailRequest {
 
  @ApiProperty()
  readonly email: string;
}

export class ForgetPasswordSecretKeyRequest {
 
  @ApiProperty()
  readonly secretKey: string;
}



export class UpdatePasswordRequest {
  @ApiProperty()
  @IsNotEmpty({ message: 'A password is required' })
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'An email is required' })
  readonly email: string;
}

export class SetPasswordRequest {
  @ApiProperty()
  @IsNotEmpty({ message: 'Old password is required' })
  readonly oldPassword: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'An password is required' })
  readonly password: string;
}
export class ResetPasswordRequest {
  @ApiProperty()
  @IsNotEmpty({ message: 'An password is required' })
  readonly password: string;
}


export class TokenVerificationRequest {
  @ApiProperty()
  @IsNotEmpty({ message: 'secretToken is required' })
  readonly secretToken: string;
}
export class ForgotPasswordRequest {
  @ApiProperty()
  @IsNotEmpty({ message: 'Email is required' })
  readonly email: string;
}
