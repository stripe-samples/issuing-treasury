DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'users') THEN
      -- prisma-generated migration for initial table state, which may be unnecessary
      -- depending on how the user set up their table originally

      -- CreateTable
      CREATE TABLE "users" (
          "id" SERIAL NOT NULL,
          "email" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "account_id" TEXT NOT NULL,
          "last_login_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

          CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      );

      -- CreateIndex
      CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
  END IF;
END
$$;
