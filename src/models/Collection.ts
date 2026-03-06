import mongoose, { Document, Schema } from "mongoose";

export interface ICuratedCollection extends Document {
  title: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReel extends Document {
  link: string;
  title: string;
  description?: string;
  actionButtonLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CuratedCollectionSchema = new Schema<ICuratedCollection>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
  },
  {
    timestamps: true,
  }
);

const ReelSchema = new Schema<IReel>(
  {
    link: {
      type: String,
      required: [true, "Link is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
    },
    actionButtonLink: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

ReelSchema.index({ title: "text", link: "text" });

export const CuratedCollection = mongoose.model<ICuratedCollection>(
  "CuratedCollection",
  CuratedCollectionSchema
);

export const Reel = mongoose.model<IReel>("Reel", ReelSchema);

