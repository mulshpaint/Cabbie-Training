import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  council: string;
  courseId: mongoose.Types.ObjectId;
  notes?: string;
  stripeSessionId?: string;
  status: "pending" | "confirmed" | "paid" | "cancelled" | "refunded";
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    council: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    notes: { type: String },
    stripeSessionId: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "paid", "cancelled", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking: Model<IBooking> =
  mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
