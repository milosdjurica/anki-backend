import { IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateCardDto {
  // @IsNumber()
  // @Min(0)
  // deckId: number;

  @IsString()
  @MinLength(1)
  @MaxLength(99)
  question: string;

  @IsString()
  @MinLength(1)
  @MaxLength(99)
  answer: string;
}
