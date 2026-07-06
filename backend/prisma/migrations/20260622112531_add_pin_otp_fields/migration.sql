-- CreateTable
CREATE TABLE "Well" (
    "id" TEXT NOT NULL,
    "wellId" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Well_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reading" (
    "id" TEXT NOT NULL,
    "wellKey" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "downholePressure" DECIMAL,
    "downholeTemp" DECIMAL,
    "tubingHeadPressure" DECIMAL,
    "casingPressure" DECIMAL,
    "flowLinePressure" DECIMAL,
    "flowLineTemp" DECIMAL,
    "batteryVoltage" DECIMAL,
    "batteryLevel" DECIMAL,

    CONSTRAINT "Reading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'operator',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pin" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "otp" TEXT,
    "otpExpiresAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Well_wellId_key" ON "Well"("wellId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Reading" ADD CONSTRAINT "Reading_wellKey_fkey" FOREIGN KEY ("wellKey") REFERENCES "Well"("id") ON DELETE CASCADE ON UPDATE CASCADE;
