import dbConnect from "@/lib/mongodb";
import ReviewCache, { IReview } from "@/models/ReviewCache";

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

async function fetchFromGoogle(): Promise<IReview[]> {
  if (!GOOGLE_API_KEY || !PLACE_ID) {
    console.warn("Google Places API key or Place ID not configured");
    return [];
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${GOOGLE_API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Places API error: ${response.statusText}`);
  }

  const data = await response.json();
  const reviews = data.result?.reviews || [];

  return reviews.map(
    (r: {
      author_name: string;
      profile_photo_url?: string;
      rating: number;
      text: string;
      relative_time_description: string;
      time: number;
    }) => ({
      authorName: r.author_name,
      authorPhoto: r.profile_photo_url,
      rating: r.rating,
      text: r.text,
      relativeTime: r.relative_time_description,
      time: r.time,
      visible: true,
    })
  );
}

export async function getReviews(): Promise<IReview[]> {
  await dbConnect();

  const placeId = PLACE_ID || "default";
  const cached = await ReviewCache.findOne({ placeId });

  if (cached) {
    const age = Date.now() - cached.fetchedAt.getTime();
    if (age < CACHE_DURATION_MS) {
      return cached.reviews.filter((r) => r.visible);
    }
  }

  try {
    const freshReviews = await fetchFromGoogle();

    if (freshReviews.length > 0) {
      await ReviewCache.findOneAndUpdate(
        { placeId },
        { reviews: freshReviews, fetchedAt: new Date() },
        { upsert: true, returnDocument: "after" }
      );
      return freshReviews.filter((r) => r.visible);
    }
  } catch (error) {
    console.error("Failed to fetch Google reviews:", error);
  }

  if (cached) {
    return cached.reviews.filter((r) => r.visible);
  }

  return [];
}

export async function forceRefreshReviews(): Promise<IReview[]> {
  const reviews = await fetchFromGoogle();
  const placeId = PLACE_ID || "default";

  await dbConnect();
  await ReviewCache.findOneAndUpdate(
    { placeId },
    { reviews, fetchedAt: new Date() },
    { upsert: true, returnDocument: "after" }
  );

  return reviews;
}
