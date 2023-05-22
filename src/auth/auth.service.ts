import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserSignupDto } from './dto/auth.signup.dto';
import { Student } from '../entities/Student';

import * as generator from 'generate-password';
import * as bcrypt from 'bcrypt';
import { MailingService } from '../mailing/mailing.service';
import { AuthProvider } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private maillingService: MailingService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    console.log('check user', email, pass);
    const user = await this.userService.findOne(email);
    console.log('check user find', user);
    const passwordMatch = await bcrypt.compare(pass, user.password);
    if (user && passwordMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  //local strategy login
  async login(user: any) {
    // console.log(user);
    const payload = { username: user.username, sub: user.userId };
    return {
      status: 'success',
      data: {
        userId: user.id,
        access_token: this.jwtService.sign(payload),
        userName: user.username,
        email: user.email,
      },
    };
  }
  async signup(userSignupDto: UserSignupDto): Promise<AuthResponse> {
    const email = userSignupDto.email.toLowerCase();
    const foundUser = await this.userService.findUserByEmail(email);
    if (foundUser) {
      throw new BadRequestException('Email already exists');
    }
    console.log('check');

    const user = new Student();
    user.email = email;
    user.username = userSignupDto.email.split('@')[0];
    const randomPassword = generator.generate({
      length: 8,
      numbers: true,
      uppercase: true,
    });
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    user.password = hashedPassword;
    console.log('password random: ', user.password);
    user.isActive = 0;
    // user.authProvider = AuthProvider.LOCAL;
    const savedUser = await this.userService.create(user);
    const subject = 'Verficiaction Code';
    const content = `<p>this is default password: <b>${randomPassword}</b>. Please change password after login</p>`;
    console.log('check send mail', user.email, subject, content);
    this.maillingService.sendMail(user.email, subject, content);
    return {
      status: 'success',
      data: {
        userId: savedUser.id,
        access_token: '',
        userName: savedUser.username,
        email: savedUser.email,
      },
    };
  }

  //google strategy login
  // async googleLogin(req: any) {
  //   if (!req.user) {
  //     throw new BadRequestException('No user from google');
  //   }
  //   const foundUser = await this.userService.findUserByEmail(req.user.email);
  //   if (foundUser) {
  //     if (foundUser.authProvider !== AuthProvider.GOOGLE) {
  //       throw new BadRequestException(
  //         `email ${req.user.email} is already used by another auth provider`,
  //       );
  //     }
  //     else {
  //       const payload = { username: foundUser.username, sub: 12 };
  //       return {
  //         status: 'success',
  //         data: {
  //           userId: foundUser.userId,
  //           access_token: this.jwtService.sign(payload),
  //           userName: foundUser.username,
  //           avatarURL: foundUser.avatarUrl,
  //           payment: 'free',
  //         },
  //       };
  //     }
  //   }
  //   else {
  //     const user = new User();
  //     user.email = req.user.email;
  //     user.username = req.user.email.split('@')[0];
  //     user.password = 'google_auth';
  //     user.isActive = 1;
  //     user.authProvider = AuthProvider.GOOGLE;
  //     const savedUser = await this.userService.create(user);
  //     const payload = { username: savedUser.username, sub: savedUser.userId };
  //     return {
  //       status: 'success',
  //       data: {
  //         userId: savedUser.userId,
  //         access_token: this.jwtService.sign(payload),
  //         userName: savedUser.username,
  //         avatarURL: savedUser.avatarUrl,
  //         payment: 'free',
  //       },
  //     };
  //   }
  // }
}
