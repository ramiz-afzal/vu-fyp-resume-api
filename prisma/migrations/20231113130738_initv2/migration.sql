/*
  Warnings:

  - A unique constraint covering the columns `[illiterateEmployeeId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_userId_fkey`;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `illiterateEmployeeId` INTEGER NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    MODIFY `userId` INTEGER NULL;

-- CreateTable
CREATE TABLE `IlliterateEmployee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `designation` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Employee_illiterateEmployeeId_key` ON `Employee`(`illiterateEmployeeId`);

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_illiterateEmployeeId_fkey` FOREIGN KEY (`illiterateEmployeeId`) REFERENCES `IlliterateEmployee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
