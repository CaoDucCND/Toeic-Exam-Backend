import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      console.log('check error', err, user, info);
      throw err || new UnauthorizedException('missing field');
    }
    return user;
  }
}
