import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@Src/prisma/prisma.service';
import { CreateDeckDto } from '../dto';

@Injectable()
export class DecksService {
  constructor(private prisma: PrismaService) {}

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

  async findDecksByUserId(userId: number) {
    const decks = await this.prisma.deck.findMany({
      where: {
        userId,
      },
    });
    return decks;
  }
}
