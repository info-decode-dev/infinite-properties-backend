-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "actualPrice" DECIMAL(12,2) NOT NULL,
    "offerPrice" DECIMAL(12,2),
    "bhkType" TEXT NOT NULL,
    "constructionStatus" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locationId" TEXT NOT NULL,
    "developerInfoId" TEXT NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "exactLocation" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeveloperInfo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeveloperInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyAmenity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyAmenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "clientName" TEXT NOT NULL,
    "profilePicture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyMedia" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "testimonialId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CuratedCollection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CuratedCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reel" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "actionButtonLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedProperty" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientLogos" TEXT[],

    CONSTRAINT "FeaturedProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedMedia" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "featuredPropertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeaturedMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUs" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "tagline" TEXT,
    "mission" TEXT,
    "vision" TEXT,
    "story" TEXT,
    "values" TEXT[],
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutUs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUsStatistic" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "icon" TEXT,
    "suffix" TEXT,
    "prefix" TEXT,
    "aboutUsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AboutUsStatistic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUsAchievement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT,
    "aboutUsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AboutUsAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUsTeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "bio" TEXT,
    "image" TEXT,
    "email" TEXT,
    "aboutUsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AboutUsTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUsSocialLinks" (
    "id" TEXT NOT NULL,
    "linkedin" TEXT,
    "twitter" TEXT,
    "facebook" TEXT,
    "teamMemberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AboutUsSocialLinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUsContactInfo" (
    "id" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "aboutUsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutUsContactInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUsSocialMedia" (
    "id" TEXT NOT NULL,
    "facebook" TEXT,
    "twitter" TEXT,
    "instagram" TEXT,
    "linkedin" TEXT,
    "youtube" TEXT,
    "contactInfoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AboutUsSocialMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Property_locationId_key" ON "Property"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "Property_developerInfoId_key" ON "Property"("developerInfoId");

-- CreateIndex
CREATE INDEX "Property_title_idx" ON "Property"("title");

-- CreateIndex
CREATE INDEX "Property_bhkType_idx" ON "Property"("bhkType");

-- CreateIndex
CREATE INDEX "Property_constructionStatus_idx" ON "Property"("constructionStatus");

-- CreateIndex
CREATE INDEX "Property_createdAt_idx" ON "Property"("createdAt");

-- CreateIndex
CREATE INDEX "Property_locationId_idx" ON "Property"("locationId");

-- CreateIndex
CREATE INDEX "Property_title_description_idx" ON "Property"("title", "description");

-- CreateIndex
CREATE INDEX "Location_city_idx" ON "Location"("city");

-- CreateIndex
CREATE INDEX "Location_state_idx" ON "Location"("state");

-- CreateIndex
CREATE INDEX "Location_country_idx" ON "Location"("country");

-- CreateIndex
CREATE INDEX "Location_city_state_idx" ON "Location"("city", "state");

-- CreateIndex
CREATE INDEX "DeveloperInfo_name_idx" ON "DeveloperInfo"("name");

-- CreateIndex
CREATE INDEX "PropertyAmenity_propertyId_idx" ON "PropertyAmenity"("propertyId");

-- CreateIndex
CREATE INDEX "Testimonial_title_idx" ON "Testimonial"("title");

-- CreateIndex
CREATE INDEX "Testimonial_clientName_idx" ON "Testimonial"("clientName");

-- CreateIndex
CREATE INDEX "Testimonial_title_clientName_description_idx" ON "Testimonial"("title", "clientName", "description");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyMedia_testimonialId_key" ON "PropertyMedia"("testimonialId");

-- CreateIndex
CREATE INDEX "CuratedCollection_title_idx" ON "CuratedCollection"("title");

-- CreateIndex
CREATE INDEX "Reel_title_idx" ON "Reel"("title");

-- CreateIndex
CREATE INDEX "Reel_link_idx" ON "Reel"("link");

-- CreateIndex
CREATE INDEX "Reel_title_description_idx" ON "Reel"("title", "description");

-- CreateIndex
CREATE INDEX "FeaturedProperty_title_idx" ON "FeaturedProperty"("title");

-- CreateIndex
CREATE INDEX "FeaturedProperty_title_description_idx" ON "FeaturedProperty"("title", "description");

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedMedia_featuredPropertyId_key" ON "FeaturedMedia"("featuredPropertyId");

-- CreateIndex
CREATE UNIQUE INDEX "AboutUs_companyName_key" ON "AboutUs"("companyName");

-- CreateIndex
CREATE INDEX "AboutUsStatistic_aboutUsId_idx" ON "AboutUsStatistic"("aboutUsId");

-- CreateIndex
CREATE INDEX "AboutUsAchievement_aboutUsId_idx" ON "AboutUsAchievement"("aboutUsId");

-- CreateIndex
CREATE INDEX "AboutUsTeamMember_aboutUsId_idx" ON "AboutUsTeamMember"("aboutUsId");

-- CreateIndex
CREATE UNIQUE INDEX "AboutUsSocialLinks_teamMemberId_key" ON "AboutUsSocialLinks"("teamMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "AboutUsContactInfo_aboutUsId_key" ON "AboutUsContactInfo"("aboutUsId");

-- CreateIndex
CREATE UNIQUE INDEX "AboutUsSocialMedia_contactInfoId_key" ON "AboutUsSocialMedia"("contactInfoId");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_developerInfoId_fkey" FOREIGN KEY ("developerInfoId") REFERENCES "DeveloperInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAmenity" ADD CONSTRAINT "PropertyAmenity_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyMedia" ADD CONSTRAINT "PropertyMedia_testimonialId_fkey" FOREIGN KEY ("testimonialId") REFERENCES "Testimonial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedMedia" ADD CONSTRAINT "FeaturedMedia_featuredPropertyId_fkey" FOREIGN KEY ("featuredPropertyId") REFERENCES "FeaturedProperty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutUsStatistic" ADD CONSTRAINT "AboutUsStatistic_aboutUsId_fkey" FOREIGN KEY ("aboutUsId") REFERENCES "AboutUs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutUsAchievement" ADD CONSTRAINT "AboutUsAchievement_aboutUsId_fkey" FOREIGN KEY ("aboutUsId") REFERENCES "AboutUs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutUsTeamMember" ADD CONSTRAINT "AboutUsTeamMember_aboutUsId_fkey" FOREIGN KEY ("aboutUsId") REFERENCES "AboutUs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutUsSocialLinks" ADD CONSTRAINT "AboutUsSocialLinks_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "AboutUsTeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutUsContactInfo" ADD CONSTRAINT "AboutUsContactInfo_aboutUsId_fkey" FOREIGN KEY ("aboutUsId") REFERENCES "AboutUs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutUsSocialMedia" ADD CONSTRAINT "AboutUsSocialMedia_contactInfoId_fkey" FOREIGN KEY ("contactInfoId") REFERENCES "AboutUsContactInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
