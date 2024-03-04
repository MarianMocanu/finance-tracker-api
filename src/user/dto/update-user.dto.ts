import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email?: string;
}
