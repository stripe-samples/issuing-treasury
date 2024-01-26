DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'users') THEN

      -- if the users table has been created through other means, then migrate it to add new fields
      ALTER TABLE "users" ADD COLUMN "last_login_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      ALTER TABLE "users" ALTER COLUMN "last_login_at" SET NOT NULL;

      ALTER TABLE "users" ADD COLUMN "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;

      ALTER TABLE "users" ADD COLUMN "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;

  END IF;
END
$$;
