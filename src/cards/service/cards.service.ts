import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@Src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateCardDto, UpdateCardDto } from '../dto';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  // !CREATE NEW CARD
  async create(userId: number, deckId: number, createCardDto: CreateCardDto) {
    const { question, answer } = createCardDto;
    await this.validateDeck(userId, deckId);

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

  async findAllCardsFromDeck(userId: number, deckId: number) {
    const deck = await this.prisma.deck.findUnique({
      where: { deckId },
      include: { cards: true },
    });

    if (!deck) throw new NotFoundException(`Deck with id ${deckId} not found`);

    if (deck.userId !== userId)
      throw new UnauthorizedException(
        'You are not authorized to access this deck',
      );

    return deck.cards;
  }

  async findOne(userId: number, deckId: number, cardId: number) {
    const cards = await this.findAllCardsFromDeck(userId, deckId);
    const card = cards.find((card) => card.cardId === cardId);

    return card
      ? card
      : `Could not find card with cardId ${cardId} in deck with deckId ${deckId} .`;
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

  async validateDeck(userId: number, deckId: number) {
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
