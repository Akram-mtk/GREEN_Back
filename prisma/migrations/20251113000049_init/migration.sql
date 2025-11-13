BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [Users_id_df] DEFAULT NEWID(),
    [first_name] NVARCHAR(1000) NOT NULL,
    [last_name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(1000),
    [password_hash] NVARCHAR(1000) NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [Users_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Users_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [last_login] DATETIME2,
    [updated_at] DATETIME2 CONSTRAINT [Users_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[RfidCards] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [RfidCards_id_df] DEFAULT NEWID(),
    [user_id] UNIQUEIDENTIFIER,
    [hashed_uid] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [RfidCards_status_df] DEFAULT 'issued',
    [issued_at] DATETIME2 NOT NULL CONSTRAINT [RfidCards_issued_at_df] DEFAULT CURRENT_TIMESTAMP,
    [last_used_at] DATETIME2,
    CONSTRAINT [RfidCards_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RfidCards_hashed_uid_key] UNIQUE NONCLUSTERED ([hashed_uid])
);

-- CreateTable
CREATE TABLE [dbo].[SeatCategories] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [SeatCategories_id_df] DEFAULT NEWID(),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    CONSTRAINT [SeatCategories_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Seats] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [Seats_id_df] DEFAULT NEWID(),
    [section] NVARCHAR(1000),
    [row] NVARCHAR(1000),
    [number] NVARCHAR(1000),
    [category_id] UNIQUEIDENTIFIER,
    CONSTRAINT [Seats_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Seats_section_row_number_key] UNIQUE NONCLUSTERED ([section],[row],[number])
);

-- CreateTable
CREATE TABLE [dbo].[Gates] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [Gates_id_df] DEFAULT NEWID(),
    [code] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Gates_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Gates_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Gates_code_key] UNIQUE NONCLUSTERED ([code])
);

-- AddForeignKey
ALTER TABLE [dbo].[RfidCards] ADD CONSTRAINT [RfidCards_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Seats] ADD CONSTRAINT [Seats_category_id_fkey] FOREIGN KEY ([category_id]) REFERENCES [dbo].[SeatCategories]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
