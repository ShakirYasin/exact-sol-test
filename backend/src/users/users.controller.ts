import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
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

  @Put('profile')
  @UseGuards(JwtGuard)
  updateProfile(
    @Request() req,
    @Body()
    updateProfileDto: {
      firstName: string;
      lastName: string;
      password?: string;
      confirmPassword?: string;
    },
  ) {
    return this.usersService.updateProfile(req.user.id, updateProfileDto);
  }
}
