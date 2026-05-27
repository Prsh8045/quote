-- CreateEnum
CREATE TYPE "FeatureAvailability" AS ENUM ('INCLUDED', 'ADDON', 'NOT_AVAILABLE');

-- CreateEnum
CREATE TYPE "PricingModel" AS ENUM ('FIXED', 'PER_SEAT', 'PERCENTAGE');

-- CreateEnum
CREATE TYPE "ContractTerm" AS ENUM ('MONTHLY', 'ANNUAL', 'TWO_YEAR');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Tier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TierFeature" (
    "id" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "availability" "FeatureAvailability" NOT NULL,
    "pricingModel" "PricingModel",
    "price" DOUBLE PRECISION,

    CONSTRAINT "TierFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "quoteName" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "term" "ContractTerm" NOT NULL,
    "discountPercent" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "productId" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteAddon" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "seats" INTEGER,
    "calculatedPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "QuoteAddon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tier" ADD CONSTRAINT "Tier_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TierFeature" ADD CONSTRAINT "TierFeature_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "Tier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TierFeature" ADD CONSTRAINT "TierFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "Tier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteAddon" ADD CONSTRAINT "QuoteAddon_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteAddon" ADD CONSTRAINT "QuoteAddon_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
