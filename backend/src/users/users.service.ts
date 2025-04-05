import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find();
    return users.map(({ password: _, ...user }) => user);
  }

  async createAdmin(userData: Partial<User>): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log({existingUser})
      throw new ConflictException('Email already exists');
    }

    if (!userData.password) {
      throw new UnauthorizedException('Password is required');
    }

    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = this.userRepository.create({
        ...userData,
        password: hashedPassword,
        role: UserRole.ADMIN,
      });

      await this.userRepository.save(user);
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      throw new UnauthorizedException('Admin creation failed');
    }
  }

  async updateProfile(
    userId: string,
    updateData: {
      firstName: string;
      lastName: string;
      password?: string;
      confirmPassword?: string;
    },
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (updateData.password) {
      if (updateData.password !== updateData.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const { confirmPassword: __, ...updateFields } = updateData;

    Object.assign(user, updateFields);
    await this.userRepository.save(user);

    const { password: _, ...result } = user;
    return result;
  }
}
