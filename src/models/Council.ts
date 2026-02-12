import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICouncil extends Document {
  name: string;
  displayName: string;
  note?: string;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CouncilSchema = new Schema<ICouncil>(
  {
    name: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    note: { type: String },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Council: Model<ICouncil> =
  mongoose.models.Council ||
  mongoose.model<ICouncil>("Council", CouncilSchema);

export default Council;
