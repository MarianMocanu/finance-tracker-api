import {
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEntryDto {
  constructor(
    amount: number,
    date: string,
    currency: string,
    name: string,
    comment: string,
    categoryId?: number,
  ) {
    this.amount = amount;
    this.date = date;
    this.currency = currency;
    this.name = name;
    this.comment = comment;
    this.categoryId = categoryId;
  }

  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  amount: number;

  @IsDefined()
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsString()
  @IsOptional()
  comment: string;

  @IsNumber()
  @IsOptional()
  categoryId: number;
}
