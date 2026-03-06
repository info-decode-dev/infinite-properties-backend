import mongoose, { Document, Schema } from "mongoose";

export interface IPropertyMedia {
  type: "image" | "video";
  url: string;
}

export interface ITestimonial extends Document {
  title: string;
  description?: string;
  clientName: string;
  profilePicture?: string;
  propertyMedia?: IPropertyMedia;
  createdAt: Date;
  updatedAt: Date;
}

const PropertyMediaSchema = new Schema<IPropertyMedia>({
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

const TestimonialSchema = new Schema<ITestimonial>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
    },
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    profilePicture: {
      type: String,
    },
    propertyMedia: {
      type: PropertyMediaSchema,
    },
  },
  {
    timestamps: true,
  }
);

TestimonialSchema.index({ title: "text", clientName: "text" });

export default mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

