-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "fatherFirstName" TEXT NOT NULL,
    "fatherMiddleName" TEXT,
    "fatherLastName" TEXT NOT NULL,
    "motherFirstName" TEXT NOT NULL,
    "motherMiddleName" TEXT,
    "motherLastName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "dob" DATETIME NOT NULL,
    "photoUrl" TEXT,
    "signatureUrl" TEXT,
    CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "houseNo" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pinCode" TEXT NOT NULL,
    CONSTRAINT "Address_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StudentProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Education" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "rollNumber" TEXT,
    "yearOfPassing" TEXT NOT NULL,
    "boardName" TEXT,
    "schoolName" TEXT,
    "collegeName" TEXT,
    "universityName" TEXT,
    "course" TEXT,
    "branch" TEXT,
    "yearOfAdmission" TEXT,
    "cgpaOrPercentage" TEXT,
    "marksObtained" REAL,
    "maximumMarks" REAL,
    "marksheetUrl" TEXT,
    CONSTRAINT "Education_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StudentProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "issuedBy" TEXT NOT NULL,
    "issuedOn" DATETIME NOT NULL,
    "description" TEXT,
    "certificateUrl" TEXT,
    CONSTRAINT "Certification_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StudentProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkExperience" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "experienceLetterUrl" TEXT,
    CONSTRAINT "WorkExperience_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StudentProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SocialLinks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "linkedin" TEXT,
    "github" TEXT,
    "portfolio" TEXT,
    "other" TEXT,
    CONSTRAINT "SocialLinks_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StudentProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_profileId_key" ON "Address"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialLinks_profileId_key" ON "SocialLinks"("profileId");
