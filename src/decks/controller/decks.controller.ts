import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
}
