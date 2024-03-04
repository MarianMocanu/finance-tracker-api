import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
