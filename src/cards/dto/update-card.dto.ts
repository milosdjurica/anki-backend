import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(99)
  question?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(99)
  answer?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;
}
