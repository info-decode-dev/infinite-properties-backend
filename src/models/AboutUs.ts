import mongoose, { Document, Schema } from "mongoose";

export interface IStatistic {
  id: string;
  label: string;
  value: string;
  icon?: string;
  suffix?: string;
  prefix?: string;
}

export interface IAchievement {
  id: string;
  title: string;
  value: string;
  icon?: string;
  description?: string;
}

export interface ITeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  image?: string;
  email?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface IContactInfo {
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export interface IAboutUs extends Document {
  companyName: string;
  tagline?: string;
  mission?: string;
  vision?: string;
  story?: string;
  values?: string[];
  statistics?: IStatistic[];
  achievements?: IAchievement[];
  teamMembers?: ITeamMember[];
  contactInfo?: IContactInfo;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const StatisticSchema = new Schema<IStatistic>({
  id: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String },
  suffix: { type: String },
  prefix: { type: String },
});

const AchievementSchema = new Schema<IAchievement>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String },
  description: { type: String },
});

const SocialLinksSchema = new Schema({
  linkedin: { type: String },
  twitter: { type: String },
  facebook: { type: String },
});

const TeamMemberSchema = new Schema<ITeamMember>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  position: { type: String, required: true },
  bio: { type: String },
  image: { type: String },
  email: { type: String },
  socialLinks: { type: SocialLinksSchema },
});

const SocialMediaSchema = new Schema({
  facebook: { type: String },
  twitter: { type: String },
  instagram: { type: String },
  linkedin: { type: String },
  youtube: { type: String },
});

const ContactInfoSchema = new Schema<IContactInfo>({
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  socialMedia: { type: SocialMediaSchema },
});

const AboutUsSchema = new Schema<IAboutUs>(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    mission: {
      type: String,
    },
    vision: {
      type: String,
    },
    story: {
      type: String,
    },
    values: {
      type: [String],
      default: [],
    },
    statistics: {
      type: [StatisticSchema],
      default: [],
    },
    achievements: {
      type: [AchievementSchema],
      default: [],
    },
    teamMembers: {
      type: [TeamMemberSchema],
      default: [],
    },
    contactInfo: {
      type: ContactInfoSchema,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Only allow one AboutUs document
AboutUsSchema.index({ companyName: 1 }, { unique: true });

export default mongoose.model<IAboutUs>("AboutUs", AboutUsSchema);

