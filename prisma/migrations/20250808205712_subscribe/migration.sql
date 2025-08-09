-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "payerId" BIGINT NOT NULL,
    "payerEmail" TEXT,
    "status" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL,
    "nextPaymentDate" TIMESTAMP(3) NOT NULL,
    "initPoint" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "applicationId" BIGINT NOT NULL,
    "collectorId" BIGINT NOT NULL,
    "backUrl" TEXT NOT NULL,
    "autoRecurringId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutoRecurring" (
    "id" SERIAL NOT NULL,
    "frequency" INTEGER NOT NULL,
    "frequencyType" TEXT NOT NULL,
    "transactionAmount" DOUBLE PRECISION NOT NULL,
    "currencyId" TEXT NOT NULL,

    CONSTRAINT "AutoRecurring_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_autoRecurringId_fkey" FOREIGN KEY ("autoRecurringId") REFERENCES "AutoRecurring"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
