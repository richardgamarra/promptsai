-- CreateTable
CREATE TABLE "ads" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "eyebrow" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "ctaLabel" TEXT NOT NULL,
    "ctaUrl" TEXT NOT NULL,
    "imageUrl" TEXT,
    "accentColor" TEXT NOT NULL DEFAULT '#22d3ee',
    "position" INTEGER NOT NULL DEFAULT 4,
    "repeatEvery" INTEGER NOT NULL DEFAULT 40,
    "maxCount" INTEGER NOT NULL DEFAULT 3,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ads_enabled_idx" ON "ads"("enabled");

-- CreateIndex
CREATE INDEX "prompts_slug_idx" ON "prompts"("slug");

-- CreateIndex
CREATE INDEX "prompts_isPrivate_isUnlisted_deletedAt_createdAt_idx" ON "prompts"("isPrivate", "isUnlisted", "deletedAt", "createdAt" DESC);
