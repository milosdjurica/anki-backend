/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("userId");

-- CreateTable
CREATE TABLE "decks" (
    "deckId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "avgRating" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "decks_pkey" PRIMARY KEY ("deckId")
);

-- CreateTable
CREATE TABLE "cards" (
    "cardId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "avgRating" DOUBLE PRECISION NOT NULL,
    "ratings" DOUBLE PRECISION[],
    "deckId" INTEGER NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("cardId")
);

-- AddForeignKey
ALTER TABLE "decks" ADD CONSTRAINT "decks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "decks"("deckId") ON DELETE RESTRICT ON UPDATE CASCADE;
