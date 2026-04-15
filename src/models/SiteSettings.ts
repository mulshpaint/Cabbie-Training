import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISiteSettings extends Document {
  singletonKey: "global";
  holdingPageEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "global",
      enum: ["global"],
    },
    holdingPageEnabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
