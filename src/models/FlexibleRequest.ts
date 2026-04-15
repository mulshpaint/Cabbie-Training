import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFlexibleRequest extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  council: string;
  preferredDates: string;
  notes?: string;
  status: "pending" | "contacted" | "booked" | "cancelled";
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FlexibleRequestSchema = new Schema<IFlexibleRequest>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    council: { type: String, required: true },
    preferredDates: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "contacted", "booked", "cancelled"],
      default: "pending",
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

const FlexibleRequest: Model<IFlexibleRequest> =
  mongoose.models.FlexibleRequest ||
  mongoose.model<IFlexibleRequest>("FlexibleRequest", FlexibleRequestSchema);

export default FlexibleRequest;
