/*
  Warnings:

  - Added the required column `employmentPosition` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employmentType` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `company` ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `employmentPosition` VARCHAR(191) NOT NULL,
    ADD COLUMN `employmentType` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `experience` ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false;
