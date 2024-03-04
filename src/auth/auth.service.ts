import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signup(signupDTO: CreateUserDto): Promise<User> {
    return this.userService.create(signupDTO);
  }

  async login({ email, password }: LoginDto): Promise<{ token: string }> {
    const foundUser = await this.userService.findOneByEmail(email);
    if (!foundUser || !foundUser.comparePassword(password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      token: jwt.sign({ id: foundUser.id, email: foundUser.email }, process.env.JWT_SECRET),
    };
  }
}
