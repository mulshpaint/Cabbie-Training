import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { forceRefreshReviews } from "@/lib/google-reviews";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reviews = await forceRefreshReviews();
    return NextResponse.json({ reviews, refreshedAt: new Date() });
  } catch (error) {
    console.error("Review refresh error:", error);
    return NextResponse.json(
      { error: "Failed to refresh reviews" },
      { status: 500 }
    );
  }
}
