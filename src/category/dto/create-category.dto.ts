import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  constructor(name: string) {
    this.name = name;
  }

  @IsString()
  @IsNotEmpty()
  name: string;
}
