import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Post('admin')
  createAdmin(@Body() createAdminDto: Partial<User>) {
    return this.usersService.createAdmin(createAdminDto);
  }
}
