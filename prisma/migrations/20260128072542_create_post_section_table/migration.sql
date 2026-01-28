/*
  Warnings:

  - You are about to drop the column `content` on the `posts` table. All the data in the column will be lost.
  - Added the required column `description` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "content",
ADD COLUMN     "description" VARCHAR(500) NOT NULL,
ADD COLUMN     "image_url" TEXT;

-- CreateTable
CREATE TABLE "post_sections" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255),
    "content" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "image_url" TEXT,
    "post_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_sections_post_id_position_idx" ON "post_sections"("post_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "post_sections_post_id_position_key" ON "post_sections"("post_id", "position");

-- AddForeignKey
ALTER TABLE "post_sections" ADD CONSTRAINT "post_sections_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
