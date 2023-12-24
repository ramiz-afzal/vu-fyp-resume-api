/*
  Warnings:

  - You are about to drop the column `userId` on the `employee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[resumeId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_userId_fkey`;

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `userId`,
    ADD COLUMN `resumeId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Employee_resumeId_key` ON `Employee`(`resumeId`);

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_resumeId_fkey` FOREIGN KEY (`resumeId`) REFERENCES `Resume`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
