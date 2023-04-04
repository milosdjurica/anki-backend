import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { GetCurrentUserId } from '@Src/common/decorators';
import { CreateDeckDto, UpdateDeckDto } from '../dto';
import { DecksService } from '../service/decks.service';

@Controller('decks')
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  create(
    @GetCurrentUserId() userId: number,
    @Body() createDeckDto: CreateDeckDto,
  ) {
    return this.decksService.create(userId, createDeckDto);
  }

  @Get()
  findDecksByUserId(@GetCurrentUserId() userId: number) {
    return this.decksService.findDecksByUserId(userId);
  }

  @Get(':deckId')
  findOneDeck(
    @Param('deckId', ParseIntPipe) deckId: number,
    @GetCurrentUserId() userId: number,
  ) {
    return this.decksService.findOneDeck(deckId, userId);
  }

  @Patch(':deckId')
  updateDeck(
    @Param('deckId', ParseIntPipe) deckId: number,
    @GetCurrentUserId() userId: number,
    @Body() updateDeckDto: UpdateDeckDto,
  ) {
    return this.decksService.updateDeck(deckId, userId, updateDeckDto);
  }

  @Delete(':deckId')
  deleteDeck(
    @Param('deckId', ParseIntPipe) deckId: number,
    @GetCurrentUserId() userId: number,
  ) {
    return this.decksService.deleteDeck(deckId, userId);
  }

  @Get('practice/:deckId')
  getCardsForPractice(
    @Param('deckId', ParseIntPipe) deckId: number,
    @GetCurrentUserId() userId: number,
  ) {
    return this.decksService.getCardsForPractice(deckId, userId);
  }
}
