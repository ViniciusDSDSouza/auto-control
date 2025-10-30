/*
  Warnings:

  - Added the required column `partsPrice` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NoteStatus" AS ENUM ('OPEN', 'PAID', 'CANCELLED');

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "partsPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" "NoteStatus" NOT NULL DEFAULT 'OPEN';
