import { Module } from '@nestjs/common';
import { CardsController } from './controller/cards.controller';
import { CardsService } from './service/cards.service';

@Module({
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
