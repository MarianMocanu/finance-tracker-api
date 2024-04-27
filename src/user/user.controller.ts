import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from './user.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.validateUserId(id);
    return this.userService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.validateUserId(id);
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    this.validateUserId(id);
    return this.userService.remove(+id);
  }

  validateUserId(id: string) {
    if (isNaN(+id)) {
      throw new BadRequestException('User id is not a number');
    }
  }
}
