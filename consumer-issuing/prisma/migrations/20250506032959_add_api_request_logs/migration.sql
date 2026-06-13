-- CreateTable
CREATE TABLE "api_request_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_url" TEXT NOT NULL,
    "request_method" TEXT NOT NULL,
    "request_body" TEXT,
    "response_body" TEXT,

    CONSTRAINT "api_request_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "api_request_logs" ADD CONSTRAINT "api_request_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
