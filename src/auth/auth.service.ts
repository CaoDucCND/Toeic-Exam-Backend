import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserSignupDto } from './dto/auth.signup.dto';
import { Student } from '../entities/Student';

import * as generator from 'generate-password';
import * as bcrypt from 'bcrypt';
import { MailingService } from '../mailing/mailing.service';
import { AuthProvider } from './auth.constants';
import { ChangePassDto } from './dto/changePass.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private maillingService: MailingService,
  ) { }

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
  async changePassword(changePassDto: ChangePassDto): Promise<any> {
    console.log('check change passs', changePassDto);
    const foundUser = await this.userService.findUserByEmail(
      changePassDto.email,
    );
    if (!foundUser) {
      throw new NotFoundException('user not exist');
    }
    //found user
    const passwordMatch = await bcrypt.compare(
      changePassDto.currentPassword,
      foundUser.password,
    );
    if (!passwordMatch) {
      throw new BadRequestException('old password incorrect');
    }
    const hashedPassword = await bcrypt.hash(changePassDto.newPassword, 10);
    const inforUpdateReturn = await this.userService.updatePasswordById(
      foundUser.id,
      hashedPassword,
    );
    if (inforUpdateReturn.affected > 0) {
      return {
        statusCode: '200',
        message: 'success',
      };
    } else {
      throw new InternalServerErrorException();
    }
  }
}
