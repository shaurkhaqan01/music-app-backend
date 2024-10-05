import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags,ApiConsumes } from '@nestjs/swagger';
import { Public } from 'src/decorators/isPublic';
import { User } from 'src/user/entities/user.entity';
// import { LoginRequest } from 'src/utils/requests';
import { AuthService } from './auth.service';
import { ForgetPasswordEmailRequest, ForgetPasswordSecretKeyRequest, LoginRequest, ResetPasswordRequest } from 'src/utils/requests';
import {
 
  UseInterceptors,
  UploadedFile,

} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Auth Controller')
@Controller('auth')
@ApiBearerAuth('Authorization')
export class AuthController {
  constructor(
    private readonly authService: AuthService,

    ) {}
  // @Public()
  // @ApiBody({ type: TokenVerificationRequest })
  // @Post('/verify-registration-token')
  // async verifyRegistrationToken(@Body() body: TokenVerificationRequest) {
  //   const { secretToken } = body;    
  //   console.log(secretToken);
  //   if(secretToken){
  //     const user = await this.authService.verifyRegistrationToken(secretToken);    
  //     console.log(user);
  //     if(!user){
  //       throw new NotFoundException('Not found');
  //     }
  //     const accessToken = await this.authService.generateAccessToken(user);
  //     const refreshToken = await this.authService.generateRefreshToken(user);
  //     const payload = {
  //       ...this.buildResponsePayload(user, accessToken, refreshToken),
  //     };
  //     return {
  //       status: 'success',
  //       data: payload,
  //     };
  //   }
  //   else{
  //     throw new NotFoundException('User not found');
  //   }
    
  // }

  @Public()
  @ApiBody({ type: LoginRequest })
  @Post('/login')
  public async login(@Body() body: LoginRequest) {
    const { email, password } = body;
    const user = await this.authService.findUserByEmail(email);
    if(user.isVerified === false){
      throw new UnauthorizedException('User is not verified');
    }


    if (user && user.isVerified === true) {
      const valid = user
        ? await this.authService.validateCredentials(user, password)
        : false;
      if (!valid) {
        throw new UnauthorizedException('Invalid credentials.');
      }
    } else if (user && !user.isVerified) {
      throw new UnauthorizedException('User is not verified.');
    } else {
      throw new UnauthorizedException('User does not exists.');
    }
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

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

  @Public()
  @ApiBody({ type: ResetPasswordRequest })
  @Post('/reset-password/:secretToken')
  public async resetPassword(@Body() body: ResetPasswordRequest,@Param('secretToken') secretToken: string) {
    const { password } = body;
    const user = await this.authService.findBySecretToken(secretToken);
    if (!user) {
      throw new UnauthorizedException('Invalid User.');
    }
    const updatedUser = await this.authService.resetPassword(
      user,
      password,
    );
    if (!updatedUser) {
      throw new ConflictException(
        'Unable to update password for the user. Please try restarting the process.',
      );
    }
    return {
      status: 'success',
    };
  }

  // @ApiBody({ type: SetPasswordRequest })
  // @Post('/update-password/:id')
  // public async setPassword(@Body() body: SetPasswordRequest,@Param('id') id: string) {
  //   const { password, oldPassword } = body;
  //   const user = await this.authService.findById(id);
  //   if (!user) {
  //     throw new UnauthorizedException('Invalid User.');
  //   }
  //   const updatedUser = await this.authService.setNewPassword(
  //     user,
  //     password,
  //     oldPassword
  //   );
  //   if (!updatedUser) {
  //     throw new ConflictException(
  //       'Unable to update password for the user. Please try restarting the process.',
  //     );
  //   }
  //   return {
  //     status: 'success',
  //   };
  // }

  @Public()
  @ApiBody({ type: ForgetPasswordEmailRequest })
  @Post('/forget-password-email')
  async forgetPassword(@Body() body: ForgetPasswordEmailRequest) {
    const { email } = body;    
    if(email){
      const user = await this.authService.findUserByEmail(email);    
      if(!user){
        throw new NotFoundException('Email Not found');
      }
      else{
        user.secretKey = (Math.floor(Math.random() * 100000) + 100000).toString();
        await this.authService.updateUser(user.id,{secretKey:user.secretKey});
        await this.authService.emailSending(user.email, user.secretToken)
        return {
          status: 'Code sent successfully',
        }
      }
    }
    else{
      throw new NotFoundException('Email not found');
    } 
  }

  @Public()
  @ApiBody({ type: ForgetPasswordSecretKeyRequest })
  @Post('/forget-password-token-verification')
  async forgetPasswordTokenVerification(@Body() body: ForgetPasswordSecretKeyRequest) {
    const { secretKey } = body;    
    if(secretKey){
      const user = await this.authService.findUserBySecretKey(secretKey);    
      if(!user){
        throw new NotFoundException('Invalid Otp');
      }
      else{
        return {
          message:"token verified successfully",
          secretToken: user.secretToken
        }
      }
    }
    else{
      throw new NotFoundException('Invalid Otp');
    }
    
  }

  @Public()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Post('attachment-upload')
  create(
    @UploadedFile() file: Express.Multer.File,
  ) {        
    return this.authService.fileUpload(file);
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
}
