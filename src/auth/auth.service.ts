import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/infraestructure/user.entity';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const { data } = await this.usersService.findOne(email);

    if (data && (await bcrypt.compare(pass, data.password))) {
      const { password, ...result } = data;
      return result;
    }
    return null;
  }

  async login(user: User, res: Response) {
    try {
      const payload = { email: user.email, sub: user.id };
      const token = this.jwtService.sign(payload);
      res.cookie('token', token, {
        httpOnly: true,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Usuario logeado con exito',
        data: { user, token },
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  async me(res: Response, req: Request) {
    const token = req.cookies['token'];
    const decodedJwtAccessToken = await this.jwtService.decode(token);
    if (decodedJwtAccessToken === null) {
      res.clearCookie('token');
      throw new NotFoundException();
    }
    const user = await this.usersService.findUserById(
      decodedJwtAccessToken.sub,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Usuario logeado con exito',
      data: { user, token },
    };
  }

  async signout(req: Request, res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Logged out succefully' });
  }
}
