/*
  Warnings:

  - You are about to drop the column `company` on the `experience` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `experience` DROP COLUMN `company`,
    ADD COLUMN `companyId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
