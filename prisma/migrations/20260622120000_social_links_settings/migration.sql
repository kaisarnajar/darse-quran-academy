-- CreateTable
CREATE TABLE "SocialLinksSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "whatsappNumber" TEXT NOT NULL DEFAULT '917006025120',
    "whatsappDefaultMessage" TEXT NOT NULL DEFAULT 'Assalamu Alaikum, I would like to know more about Darse Quran Academy.',
    "facebookUrl" TEXT NOT NULL DEFAULT 'https://facebook.com',
    "instagramUrl" TEXT NOT NULL DEFAULT 'https://instagram.com',
    "youtubeUrl" TEXT NOT NULL DEFAULT 'https://youtube.com',
    "updatedAt" DATETIME NOT NULL
);
