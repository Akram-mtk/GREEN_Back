-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password_hash" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfidCards" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "hashed_uid" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'issued',
    "issued_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMPTZ(6),

    CONSTRAINT "RfidCards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeatCategories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "SeatCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seats" (
    "id" UUID NOT NULL,
    "section" TEXT,
    "row" TEXT,
    "number" TEXT,
    "category_id" UUID,

    CONSTRAINT "Seats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gates" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RfidCards_hashed_uid_key" ON "RfidCards"("hashed_uid");

-- CreateIndex
CREATE UNIQUE INDEX "Seats_section_row_number_key" ON "Seats"("section", "row", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Gates_code_key" ON "Gates"("code");

-- AddForeignKey
ALTER TABLE "RfidCards" ADD CONSTRAINT "RfidCards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seats" ADD CONSTRAINT "Seats_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "SeatCategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
