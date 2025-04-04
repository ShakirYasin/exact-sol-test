import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import { JwtGuard } from './jwt.guard';
import { RequestWithUser } from 'src/types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: Partial<User>) {
    return this.authService.register(registerDto);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getProfile(@Request() req: RequestWithUser) {
    return this.authService.findById(req.user.userId);
  }
}
