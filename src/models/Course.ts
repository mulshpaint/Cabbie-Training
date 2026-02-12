import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourse extends Document {
  date: Date;
  location: string;
  spotsTotal: number;
  spotsRemaining: number;
  price: number;
  type: "fixed" | "flexible";
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    date: { type: Date, required: true },
    location: { type: String, required: true, default: "Rochford, Essex" },
    spotsTotal: { type: Number, required: true, default: 8 },
    spotsRemaining: { type: Number, required: true, default: 8 },
    price: { type: Number, required: true },
    type: { type: String, enum: ["fixed", "flexible"], required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
