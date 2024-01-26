/*
  Warnings:

  - Made the column `country` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `use_case` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "use_case" SET NOT NULL;
