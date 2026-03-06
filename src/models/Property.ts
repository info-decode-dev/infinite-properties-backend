// @ts-nocheck
// Legacy Mongoose models - not used (using Prisma instead)
// import mongoose, { Document, Schema } from "mongoose";

export interface ILocation {
  exactLocation: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface IAmenity {
  id: string;
  name: string;
  icon?: string;
}

export interface IDeveloperInfo {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  description?: string;
}

export interface IProperty extends Document {
  title: string;
  description: string;
  images: string[];
  actualPrice: number;
  offerPrice?: number;
  location: ILocation;
  bhkType: "1 BHK" | "2 BHK" | "3 BHK" | "4 BHK" | "5+ BHK" | "Studio";
  constructionStatus: "Ready to Move" | "Under Construction" | "Pre-Launch";
  tags: ("New" | "Luxury" | "Best Deal" | "Featured" | "Hot Deal")[];
  amenities: IAmenity[];
  developerInfo: IDeveloperInfo;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schemas commented out - using Prisma instead
// const LocationSchema = new Schema<ILocation>({
//   exactLocation: { type: String, required: true },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   country: { type: String, required: true },
//   latitude: { type: Number },
//   longitude: { type: Number },
// });

// const AmenitySchema = new Schema<IAmenity>({
//   id: { type: String, required: true },
//   name: { type: String, required: true },
//   icon: { type: String },
// });

// const DeveloperInfoSchema = new Schema<IDeveloperInfo>({
//   name: { type: String, required: true },
//   email: { type: String },
//   phone: { type: String },
//   website: { type: String },
//   description: { type: String },
// });

// const PropertySchema = new Schema<IProperty>(
//   {
//     title: {
//       type: String,
//       required: [true, "Title is required"],
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: [true, "Description is required"],
//     },
//     images: {
//       type: [String],
//       default: [],
//     },
//     actualPrice: {
//       type: Number,
//       required: [true, "Actual price is required"],
//       min: 0,
//     },
//     offerPrice: {
//       type: Number,
//       min: 0,
//     },
//     location: {
//       type: LocationSchema,
//       required: true,
//     },
//     bhkType: {
//       type: String,
//       enum: ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK", "Studio"],
//       required: true,
//     },
//     constructionStatus: {
//       type: String,
//       enum: ["Ready to Move", "Under Construction", "Pre-Launch"],
//       required: true,
//     },
//     tags: {
//       type: [String],
//       enum: ["New", "Luxury", "Best Deal", "Featured", "Hot Deal"],
//       default: [],
//     },
//     amenities: {
//       type: [AmenitySchema],
//       default: [],
//     },
//     developerInfo: {
//       type: DeveloperInfoSchema,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// PropertySchema.index({ title: "text", description: "text" });
// PropertySchema.index({ "location.city": 1 });
// PropertySchema.index({ "location.state": 1 });

// export default mongoose.model<IProperty>("Property", PropertySchema);

