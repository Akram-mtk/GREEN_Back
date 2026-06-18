-- CreateTable
CREATE TABLE "ClubSettings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "club_name" TEXT NOT NULL DEFAULT 'Mouloudia Club d''Alger',
    "club_short_name" TEXT NOT NULL DEFAULT 'MCA',
    "stadium_name" TEXT NOT NULL DEFAULT 'Stade de Ali AMMAR Dit Ali La Pointe',
    "email" TEXT NOT NULL DEFAULT 'mouloudia@gmail.com',
    "phone" TEXT NOT NULL DEFAULT '0000000000',
    "facebook" TEXT NOT NULL DEFAULT '',
    "instagram" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "ClubSettings_pkey" PRIMARY KEY ("id")
);

-- Insert default row
INSERT INTO "ClubSettings" ("id", "club_name", "club_short_name", "stadium_name", "email", "phone", "facebook", "instagram", "created_at", "updated_at")
VALUES (gen_random_uuid(), 'Mouloudia Club d''Alger', 'MCA', 'Stade de Ali AMMAR Dit Ali La Pointe', 'mouloudia@gmail.com', '0000000000', '', '', NOW(), NOW());
