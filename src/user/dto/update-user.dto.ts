import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '../entities/user.entity';

export class UpdateUserDto {
  constructor(name: string, email: string, role: Role) {
    this.name = name;
    this.email = email;
    this.role = role;
  }

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
