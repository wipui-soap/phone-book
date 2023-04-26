/*
  Warnings:

  - Added the required column `lastName` to the `phoneNumber` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_phoneNumber" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL
);
INSERT INTO "new_phoneNumber" ("id", "name", "phone") SELECT "id", "name", "phone" FROM "phoneNumber";
DROP TABLE "phoneNumber";
ALTER TABLE "new_phoneNumber" RENAME TO "phoneNumber";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
