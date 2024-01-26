#!/bin/bash

# If you need to catch up a Prisma-managed database to some point in
# the migration stack, but can't because it's in an inconsistent or
# non-fast-forwardable state, you can run this script (and comment
# out lines up to the point you need to catch up)

DB_NAME="issuing_treasury"

db_exists=$(psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

if [ "$db_exists" != "1" ]; then
  echo "Database doesn't exist. You can run \`npx prisma migrate dev\` to create it."
  exit 1
fi

psql -d $DB_NAME -c "
  CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);

ALTER TABLE public._prisma_migrations OWNER TO postgres;

INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('c844cd5b-539f-4756-884b-b6fd3dfe40c4', '3903c0a622502043c14f4f03cd8b46de51ad1bea2f1e869548f4cab096f130b7', '2024-01-16 09:37:32.631513-08', '20230927142543_add_timestamps', NULL, NULL, '2024-01-16 09:37:32.612504-08', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('259445b2-13e2-45f6-94b6-811c5c4dce24', 'c99288107f026da43c9857e94ba0897aedd2a5a54b4a467cae7e9201c5527740', '2024-01-16 09:37:32.639183-08', '20240116150916_initial', NULL, NULL, '2024-01-16 09:37:32.63219-08', 1);

ALTER TABLE ONLY public._prisma_migrations ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);"

echo "You should now be able to run \`npx prisma migrate dev\` going forward."
