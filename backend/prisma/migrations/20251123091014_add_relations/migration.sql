/*
  Warnings:

  - You are about to drop the column `issuedBy` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the column `postedBy` on the `Internship` table. All the data in the column will be lost.
  - Added the required column `issuedById` to the `Credit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postedById` to the `Internship` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "internshipId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Application_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Application_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("createdAt", "id", "internshipId", "status", "studentId") SELECT "createdAt", "id", "internshipId", "status", "studentId" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE TABLE "new_Credit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "internshipId" INTEGER,
    "units" INTEGER NOT NULL,
    "issuedById" INTEGER NOT NULL,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Credit_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Credit_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Credit_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Credit" ("id", "internshipId", "issuedAt", "studentId", "units") SELECT "id", "internshipId", "issuedAt", "studentId", "units" FROM "Credit";
DROP TABLE "Credit";
ALTER TABLE "new_Credit" RENAME TO "Credit";
CREATE TABLE "new_Internship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "postedById" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Internship_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Internship" ("createdAt", "description", "id", "title") SELECT "createdAt", "description", "id", "title" FROM "Internship";
DROP TABLE "Internship";
ALTER TABLE "new_Internship" RENAME TO "Internship";
CREATE TABLE "new_Logbook" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "internshipId" INTEGER,
    "entry" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Logbook_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Logbook_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Logbook" ("date", "entry", "id", "internshipId", "studentId") SELECT "date", "entry", "id", "internshipId", "studentId" FROM "Logbook";
DROP TABLE "Logbook";
ALTER TABLE "new_Logbook" RENAME TO "Logbook";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
