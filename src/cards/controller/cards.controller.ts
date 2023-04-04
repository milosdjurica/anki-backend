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
import { CardsService } from '../service/cards.service';
import { CreateCardDto } from '../dto/create-card.dto';
import { UpdateCardDto } from '../dto/update-card.dto';
import { GetCurrentUserId } from '@Src/common/decorators';
@Controller('cards/:deckId')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(
    @GetCurrentUserId() userId: number,
    @Param('deckId', ParseIntPipe) deckId: number,
    @Body() createCardDto: CreateCardDto,
  ) {
    return this.cardsService.create(userId, deckId, createCardDto);
  }

  @Get()
  findAll(
    @GetCurrentUserId() userId: number,
    @Param('deckId', ParseIntPipe) deckId: number,
  ) {
    return this.cardsService.findAll(userId, deckId);
  }

  @Get(':cardId')
  findOne(
    @GetCurrentUserId() userId: number,
    @Param('deckId', ParseIntPipe) deckId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
  ) {
    return this.cardsService.findOne(userId, deckId, cardId);
  }

  @Patch(':cardId')
  update(
    @GetCurrentUserId() userId: number,
    @Param('deckId', ParseIntPipe) deckId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardsService.update(userId, deckId, cardId, updateCardDto);
  }

  @Delete(':cardId')
  remove(
    @GetCurrentUserId() userId: number,
    @Param('deckId', ParseIntPipe) deckId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
  ) {
    return this.cardsService.remove(userId, deckId, cardId);
  }
}
