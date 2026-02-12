import { NextResponse } from "next/server";
import { getReviews } from "@/lib/google-reviews";

export async function GET() {
  try {
    const reviews = await getReviews();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json([], { status: 200 });
  }
}
