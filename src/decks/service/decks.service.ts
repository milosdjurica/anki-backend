import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@Src/prisma/prisma.service';
import { CreateDeckDto, UpdateDeckDto } from '../dto';

@Injectable()
export class DecksService {
  constructor(private prisma: PrismaService) {}

  // ! CREATE NEW DECK
  async create(userId: number, createDeckDto: CreateDeckDto) {
    const { name, description } = createDeckDto;
    const deckData: Prisma.DeckCreateInput = {
      name,
      description,
      avgRating: 0,
      user: { connect: { userId } },
    };

    const deck = await this.prisma.deck.create({
      data: deckData,
    });
    return deck;
  }

  // ! FIND ALL DECKS BY USER ID
  async findDecksByUserId(userId: number) {
    const decks = await this.prisma.deck.findMany({
      where: { userId },
    });
    return decks;
  }

  // ! FIND ONE DECK BY DECK ID
  async findOneDeck(deckId: number, userId: number) {
    const deck = await this.prisma.deck.findUnique({
      where: { deckId },
    });

    if (!deck) throw new NotFoundException(`Deck with id ${deckId} not found`);

    if (deck.userId !== userId)
      throw new UnauthorizedException(
        'You are not authorized to access this deck',
      );
    return deck;
  }

  // ! UPDATE DECK
  async updateDeck(
    deckId: number,
    userId: number,
    updateDeckDto: UpdateDeckDto,
  ) {
    // !This has only one DB call but less control over the errors
    // const updateDeck = await this.prisma.deck.updateMany({
    //   where: { deckId, userId },
    //   data: updateDeckDto,
    // });
    // if (updateDeck.count === 0)
    //   throw new BadRequestException(
    //     `Something went wrong, did not update deck with id ${deckId}`,
    //   );

    // return `Deck with id ${deckId} updated successfully`;

    const deck = await this.prisma.deck.findUnique({
      where: { deckId },
    });
    if (!deck) {
      throw new NotFoundException(`Deck with id ${deckId} not found`);
    }

    if (deck.userId !== userId) {
      throw new UnauthorizedException(
        `You are not authorized to update this deck`,
      );
    }

    const updatedDeck = await this.prisma.deck.update({
      where: { deckId },
      data: updateDeckDto,
    });

    return updatedDeck;
  }

  // ! DELETE DECK BY DECK ID
  async deleteDeck(deckId: number, userId: number) {
    // ! can do with one db call like in updateDeck()

    const deck = await this.prisma.deck.findUnique({
      where: { deckId },
    });
    if (!deck) {
      throw new NotFoundException(`Deck with id ${deckId} not found`);
    }

    if (deck.userId !== userId) {
      throw new UnauthorizedException(
        `You are not authorized to delete this deck`,
      );
    }

    const deletedDeck = await this.prisma.deck.delete({
      where: { deckId },
    });

    return deletedDeck;
  }

  // ! PRACTICE
  async getCardsForPractice(deckId: number, userId: number) {
    const deck = await this.prisma.deck.findUnique({
      where: {
        deckId: deckId,
      },
      include: {
        cards: true,
      },
    });

    if (!deck) throw new NotFoundException(`Deck with id ${deckId} not found`);

    if (deck.userId !== userId)
      throw new UnauthorizedException(
        'You are not authorized to access this deck',
      );

    return deck.cards;
  }
}
