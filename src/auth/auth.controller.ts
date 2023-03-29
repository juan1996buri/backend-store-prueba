import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { User as UserEntity } from 'src/infraestructure/user.entity';
import { AuthService } from './auth.service';
import { User } from './decorator/user.decorator';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signup(
    @Res({ passthrough: true }) res: Response,
    @User() user: UserEntity,
  ) {
    return await this.authService.login(user, res);
  }

  @Get('logout')
  signout(@Req() req, @Res() res) {
    return this.authService.signout(req, res);
  }

  @Get('me')
  async me(@Res({ passthrough: true }) res, @Req() req) {
    return await this.authService.me(res, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() user: UserEntity) {
    return user;
  }
}
