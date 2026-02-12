import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview {
  authorName: string;
  authorPhoto?: string;
  rating: number;
  text: string;
  relativeTime: string;
  time: number;
  visible: boolean;
}

export interface IReviewCache extends Document {
  placeId: string;
  reviews: IReview[];
  fetchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  authorName: { type: String, required: true },
  authorPhoto: { type: String },
  rating: { type: Number, required: true },
  text: { type: String, required: true },
  relativeTime: { type: String, required: true },
  time: { type: Number, required: true },
  visible: { type: Boolean, default: true },
});

const ReviewCacheSchema = new Schema<IReviewCache>(
  {
    placeId: { type: String, required: true, unique: true },
    reviews: [ReviewSchema],
    fetchedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const ReviewCache: Model<IReviewCache> =
  mongoose.models.ReviewCache ||
  mongoose.model<IReviewCache>("ReviewCache", ReviewCacheSchema);

export default ReviewCache;
