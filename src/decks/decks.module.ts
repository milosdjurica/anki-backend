import { Module } from '@nestjs/common';
import { DecksController } from './controller/decks.controller';
import { DecksService } from './service/decks.service';

@Module({
  controllers: [DecksController],
  providers: [DecksService]
})
export class DecksModule {}
