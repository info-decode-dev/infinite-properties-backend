// @ts-nocheck
// Legacy Mongoose models - not used (using Prisma instead)
// import mongoose, { Document, Schema } from "mongoose";

export interface IMedia {
  type: "image" | "video";
  url: string;
}

export interface IFeaturedProperty extends Document {
  title: string;
  description?: string;
  media?: IMedia;
  clientLogos: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>({
  type: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const FeaturedPropertySchema = new Schema<IFeaturedProperty>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
    },
    media: {
      type: MediaSchema,
    },
    clientLogos: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

FeaturedPropertySchema.index({ title: "text" });

// export default mongoose.model<IFeaturedProperty>(
//   "FeaturedProperty",
//   FeaturedPropertySchema
// );

