-- AlterTable
ALTER TABLE "users" ADD COLUMN     "country" TEXT,
ADD COLUMN     "use_case" TEXT;

UPDATE "users" SET "country" = 'US', "use_case" = 'embedded_finance';
