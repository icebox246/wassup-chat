/*
  Warnings:

  - The required column `inviteCode` was added to the `Channel` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Channel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "topic" TEXT,
    "adminId" INTEGER NOT NULL,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inviteCode" TEXT NOT NULL,
    CONSTRAINT "Channel_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Channel" ("adminId", "createdDate", "id", "name", "topic") SELECT "adminId", "createdDate", "id", "name", "topic" FROM "Channel";
DROP TABLE "Channel";
ALTER TABLE "new_Channel" RENAME TO "Channel";
CREATE UNIQUE INDEX "Channel_inviteCode_key" ON "Channel"("inviteCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
