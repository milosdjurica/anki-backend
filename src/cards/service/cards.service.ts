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

  async update(
    userId: number,
    deckId: number,
    cardId: number,
    updateCardDto: UpdateCardDto,
  ) {
    const cards = await this.findAllCardsFromDeck(userId, deckId);
    const card = cards.find((card) => card.cardId === cardId);

    if (!card)
      return `Could not find card with cardId ${cardId} in deck with deckId ${deckId} .`;

    // !Add check for rating, manage average, and add rating in array of ratings
    // !Also maybe should limit ratings to last 20 only or even less

    const updatedCard = await this.prisma.card.update({
      where: { cardId },
      data: { ...updateCardDto },
    });

    return updatedCard;
  }

  async remove(userId: number, deckId: number, cardId: number) {
    const cards = await this.findAllCardsFromDeck(userId, deckId);
    const card = cards.find((card) => card.cardId === cardId);
    if (!card)
      return `Could not find card with cardId ${cardId} in deck with deckId ${deckId} .`;

    return this.prisma.card.delete({ where: { cardId } });
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
