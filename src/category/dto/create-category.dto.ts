import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  constructor(name: string) {
    this.name = name;
  }

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  color: string;
}
