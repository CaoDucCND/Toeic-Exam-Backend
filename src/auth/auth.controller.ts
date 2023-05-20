import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/auth.local.guard';
import { JwtAuthGuard } from './guards/auth.jwt.guard';
import { UserSignupDto } from './dto/auth.signup.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }
  @Post('signup')
  async signup(@Body() userSignupDto: UserSignupDto): Promise<any> {
    console.log("check signup", userSignupDto);
    return this.authService.signup(userSignupDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
