-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Channel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "topic" TEXT,
    "isDirect" BOOLEAN NOT NULL DEFAULT false,
    "adminId" INTEGER NOT NULL,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inviteCode" TEXT NOT NULL,
    CONSTRAINT "Channel_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Channel" ("adminId", "createdDate", "id", "inviteCode", "name", "topic") SELECT "adminId", "createdDate", "id", "inviteCode", "name", "topic" FROM "Channel";
DROP TABLE "Channel";
ALTER TABLE "new_Channel" RENAME TO "Channel";
CREATE UNIQUE INDEX "Channel_inviteCode_key" ON "Channel"("inviteCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
