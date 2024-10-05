import { BadRequestException, HttpException, Injectable, NotAcceptableException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { BASE_OPTIONS, JWT_EXPIRY, JWT_REFRESH_EXPIRY, RefreshTokenPayload } from 'src/utils/jwtOptions';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { RefreshTokenService } from './refreshToken.service';
import { JwtService } from '@nestjs/jwt';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { RefreshToken } from './entities/refreshToken.entity';
import * as bcrypt from 'bcrypt';
const nodemailer = require("nodemailer");
import { randomStr } from 'src/utils/utilities';
// import { randomStr } from 'src/utils/utilities';
// import { SESEmailService } from 'src/utils/SESEmailService';
import { Uploader } from '../utils/uploader';

@Injectable()
export class AuthService {
  // private emailService: SESEmailService;
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {
    // this.emailService = SESEmailService.getInstance();
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
  public async generateAccessToken(user: User): Promise<string> {
    const opts: SignOptions = {
      ...BASE_OPTIONS,
      subject: String(user.id),
      expiresIn: JWT_EXPIRY,
    };

    return this.jwtService.signAsync({}, opts);
  }
  // public async createAccessTokenFromRefreshToken(
  //   refresh: string,
  // ): Promise<{ token: string; user: User }> {
  //   const { user } = await this.resolveRefreshToken(refresh);

  //   const token = await this.generateAccessToken(user);

  //   return { user, token };
  // }
  // public async resolveRefreshToken(
  //   encoded: string,
  // ): Promise<{ user: User; token: RefreshToken }> {
  //   const payload = await this.decodeRefreshToken(encoded);
  //   const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

  //   if (!token) {
  //     throw new UnprocessableEntityException('Refresh token not found');
  //   }

  //   if (token.isRevoked) {
  //     throw new UnprocessableEntityException('Refresh token revoked');
  //   }
  //   const user = await this.getUserFromRefreshTokenPayload(payload);

  //   if (!user) {
  //     throw new UnprocessableEntityException('Refresh token malformed');
  //   }

  //   return { user, token };
  // }
  // private async getUserFromRefreshTokenPayload(
  //   payload: RefreshTokenPayload,
  // ): Promise<User> {
  //   const subId = payload.sub;

  //   if (!subId) {
  //     throw new UnprocessableEntityException(
  //       'Invalid subscriber for the token.',
  //     );
  //   }
  //   return this.userService.findOne(subId);
  // }
  // private async decodeRefreshToken(
  //   token: string,
  // ): Promise<RefreshTokenPayload> {
  //   try {
  //     return this.jwtService.verifyAsync(token);
  //   } catch (e) {
  //     if (e instanceof TokenExpiredError) {
  //       throw new UnprocessableEntityException('Refresh token expired');
  //     } else {
  //       throw new UnprocessableEntityException('Refresh token malformed');
  //     }
  //   }
  // }
  // private async getStoredTokenFromRefreshTokenPayload(
  //   payload: RefreshTokenPayload,
  // ): Promise<RefreshToken> {
  //   const tokenId = payload.jti;

  //   if (!tokenId) {
  //     throw new UnprocessableEntityException('Cannot find token id.');
  //   }

  //   return this.refreshTokenService.findTokenById(tokenId);
  // }
  
  // async registerUser(user: RegisterRequest) {
  //   const userObj = await this.userService.create(user);
    
  //   if (!userObj) {
  //     throw new UnprocessableEntityException(userObj);
  //   }
  //   const company =  await this.companyService.createCompany(user);
    
  //   await this.companyUserMapperService.create(userObj,company,CompanyUserPrivilege.ADMIN)
  //   return userObj;
  // }

  async validateCredentials(user: User, password: string) {
    return this.userService.validateCredentials(user, password);
  }
  async findUserByEmail(email: string) {
    return this.userService.findUserByEmail(email);
  }
  // async findUserByEmailForSignUp(email: string) {
  //   return this.userService.findUserByEmailForSignup(email);
  // }
  async findUserBySecretKey(secretKey: string) {
    return this.userService.findUserBySecretKey(secretKey);
  }
  async updateUser(id: string, user: Partial<User>) {
    const userObj = await this.userService.update(id, user);
    if (!userObj) {
      throw new UnprocessableEntityException(userObj);
    }
    return userObj;
  }

  // async generateRegistrationToken(userId: string){
  //   const { secretToken } = await this.userService.findOne(userId);
  //   const hashedToken = randomStr();
  //   await this.updateUser(userId, { secretToken: hashedToken, secretTokenCreatedAt: new Date });

  //   return { message: 'Token sent', token: hashedToken };
  // }

  async verifyRegistrationToken(token: string){            
    const user = await this.userService.findUserByToken(token);    
    if(!user){
      throw new NotFoundException('Invalid one time pin');
    }else{
      await this.updateUser(user.id, { 
        isVerified: true,
        secretToken: randomStr(),
        secretTokenCreatedAt: new Date(),
      });
      return user;
    }  
  }

  // async create(createAuthDto: CreateAuthDto) {
  //   return 'This action adds a new auth';
  // }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
  // getUsersCompanies(user: User) {
  //   return this.companyUserMapperService.getUserCompany(user);
  // }
  updatePassword(id: string, password: string) {
    return this.userService.updatePassword(id, password);
  }

  // updateStatus(id: string) {
  //   return this.userService.updateStatus(id);
  // }
  // updateUserSignedUpCheck(id: string) {
  //   return this.userService.updateEmployeeSignedUpCheck(id);
  // }
  // async sendVerificationEmail(email:string,token: string) {
  //   try {
  //     await this.emailService.sendEmail(
  //      email,
  //     'Admin_Signup',
  //      {code:token},
  //     );
  //   } catch (e) {
  //     console.log(e);
  //   }    // return this.userService.updateEmployeeSignedUpCheck(id);
  // }
  // async sendForgetPasswordEmail(email:string,name: string,code:string) {
  //   try {
  //     await this.emailService.sendEmail(
  //      email,
  //     'Forget_Password',
  //      {name:name,code:code},
  //     );
  //   } catch (e) {
  //     console.log(e);
  //   }    // return this.userService.updateEmployeeSignedUpCheck(id);
  // }
  async findById(id:string){
    return await this.userService.findById(id);
  }
  async findBySecretToken(secretToken:string){
    return await this.userService.findBySecretToken(secretToken);
  }

  setNewPassword(user: User, password: string, oldPassword:string) {
    return this.userService.setPassword(user, password, oldPassword);
  }

  resetPassword(user: User, password: string) {
    return this.userService.resetPassword(user, password);
  }

  async fileUpload(
    file: Express.Multer.File,
    
  ){
    const attachment =  await Uploader.getInstance().uploadFile(file);    
    if(attachment){
      return {
        url : attachment
      }
    }else { 
    throw new BadRequestException('Invalid file.'); 
    }
  }
  public async emailSending(email: string, otp: string) {
    let transporter = await nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: false, // true for 465, false for other ports
    auth: {
        user: "shaurkhaqan@gmail.com", // generated ethereal user
        pass: "wkhb kcaj mzkx hxth", // generated ethereal password
    },
    });
  
    let information = {
    from: '<shaurkhaqan@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Token Verification", // Subject line
    text: 'OTP:'+ '' + otp, // plain text body
    };
  
      
    let info = await transporter.sendMail(information);
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  
    }

}
