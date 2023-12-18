/*
  Warnings:

  - A unique constraint covering the columns `[imageId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imageId]` on the table `Resume` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `company` ADD COLUMN `imageId` INTEGER NULL;

-- AlterTable
ALTER TABLE `resume` ADD COLUMN `imageId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Company_imageId_key` ON `Company`(`imageId`);

-- CreateIndex
CREATE UNIQUE INDEX `Resume_imageId_key` ON `Resume`(`imageId`);

-- AddForeignKey
ALTER TABLE `Resume` ADD CONSTRAINT `Resume_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Company` ADD CONSTRAINT `Company_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
