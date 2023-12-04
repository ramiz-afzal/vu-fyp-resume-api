/*
  Warnings:

  - Made the column `firstName` on table `illiterateemployee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `illiterateemployee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `designation` on table `illiterateemployee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startDate` on table `illiterateemployee` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `illiterateemployee` MODIFY `firstName` VARCHAR(191) NOT NULL,
    MODIFY `lastName` VARCHAR(191) NOT NULL,
    MODIFY `designation` VARCHAR(191) NOT NULL,
    MODIFY `startDate` DATETIME(3) NOT NULL;
