-- CreateTable
CREATE TABLE "year_entries" (
    "key" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "year_entries_pkey" PRIMARY KEY ("key")
);
