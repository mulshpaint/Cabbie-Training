import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlackoutPeriod {
  start: Date;
  end: Date;
  reason?: string;
}

export interface ICourseSeries extends Document {
  dayOfWeek: number;
  time: string;
  location: string;
  spotsTotal: number;
  price: number;
  type: "fixed" | "flexible";
  frequency: "weekly" | "fortnightly" | "monthly";
  weeksAhead: number;
  isActive: boolean;
  blackoutPeriods: IBlackoutPeriod[];
  lastGeneratedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlackoutPeriodSchema = new Schema<IBlackoutPeriod>(
  {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    reason: { type: String },
  },
  { _id: false }
);

const CourseSeriesSchema = new Schema<ICourseSeries>(
  {
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    time: { type: String, required: true },
    location: { type: String, required: true, default: "Rochford, Essex" },
    spotsTotal: { type: Number, required: true, default: 8 },
    price: { type: Number, required: true },
    type: { type: String, enum: ["fixed", "flexible"], required: true },
    frequency: { type: String, enum: ["weekly", "fortnightly", "monthly"], default: "weekly" },
    weeksAhead: { type: Number, required: true, default: 8, min: 1, max: 12 },
    isActive: { type: Boolean, default: true },
    blackoutPeriods: { type: [BlackoutPeriodSchema], default: [] },
    lastGeneratedDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const CourseSeries: Model<ICourseSeries> =
  mongoose.models.CourseSeries ||
  mongoose.model<ICourseSeries>("CourseSeries", CourseSeriesSchema);

export default CourseSeries;
