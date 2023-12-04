/*
  Warnings:

  - You are about to drop the column `comapanyId` on the `department` table. All the data in the column will be lost.
  - You are about to drop the column `comapanyId` on the `service` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `department` DROP FOREIGN KEY `Department_comapanyId_fkey`;

-- DropForeignKey
ALTER TABLE `service` DROP FOREIGN KEY `Service_comapanyId_fkey`;

-- AlterTable
ALTER TABLE `department` DROP COLUMN `comapanyId`,
    ADD COLUMN `companyId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `service` DROP COLUMN `comapanyId`,
    ADD COLUMN `companyId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
