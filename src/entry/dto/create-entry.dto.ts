import {
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEntryDto {
  constructor(amount: number, date: Date, currency: string, name: string, comment: string) {
    this.amount = amount;
    this.date = date;
    this.currency = currency;
    this.name = name;
    this.comment = comment;
  }

  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  amount: number;

  @IsDefined()
  @IsDateString()
  @IsNotEmpty()
  date: Date;

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
