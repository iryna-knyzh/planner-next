-- CreateTable
CREATE TABLE "day_entries" (
    "key" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "theme" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "day_entries_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "week_entries" (
    "key" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "theme" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "week_entries_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "month_entries" (
    "key" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "month_entries_pkey" PRIMARY KEY ("key")
);
