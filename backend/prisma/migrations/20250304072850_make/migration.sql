/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `todo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "todo_title_key" ON "todo"("title");
