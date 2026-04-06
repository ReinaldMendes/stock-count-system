-- AlterTable
ALTER TABLE "Employee" ADD COLUMN "password" TEXT NOT NULL DEFAULT 'temp';
ALTER TABLE "Employee" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';
