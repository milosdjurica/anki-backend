import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCardDto } from '../dto/create-card.dto';
import { UpdateCardDto } from '../dto/update-card.dto';
import { PrismaService } from '@Src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  // !CREATE NEW CARD
  async create(userId: number, deckId: number, createCardDto: CreateCardDto) {
    const { question, answer } = createCardDto;

    await this.findOneDeck(userId, deckId);

    const cardData: Prisma.CardCreateInput = {
      question,
      answer,
      deck: { connect: { deckId } },
    };

    const card = await this.prisma.card.create({
      data: cardData,
    });

    return card;
  }

  findAll(userId: number, deckId: number) {
    return `This action returns all cards`;
  }

  findOne(userId: number, deckId: number, cardId: number) {
    return `This action returns a #${cardId} card`;
  }

  update(
    userId: number,
    deckId: number,
    cardId: number,
    updateCardDto: UpdateCardDto,
  ) {
    return `This action updates a #${cardId} card`;
  }

  remove(userId: number, deckId: number, cardId: number) {
    return `This action removes a #${cardId} card`;
  }

  async findOneDeck(userId: number, deckId: number) {
    const deck = await this.prisma.deck.findUnique({
      where: { deckId },
    });

    if (!deck) throw new NotFoundException(`Deck with id ${deckId} not found`);

    if (deck.userId !== userId)
      throw new UnauthorizedException(
        'You are not authorized to access this deck',
      );
  }
}
