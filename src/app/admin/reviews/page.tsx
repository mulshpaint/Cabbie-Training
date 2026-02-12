"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { RefreshCw, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Review {
  authorName: string;
  authorPhoto?: string;
  rating: number;
  text: string;
  relativeTime: string;
  visible: boolean;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      setReviews(data);
    } catch {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/reviews/refresh", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        toast.success("Reviews refreshed from Google");
      } else {
        toast.error("Failed to refresh — check your Google API key and Place ID");
      }
    } catch {
      toast.error("Failed to refresh reviews");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              Google Reviews
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Reviews are cached and auto-refresh every 24 hours.
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="font-medium"
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-1" />
            )}
            Refresh from Google
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-navy-light border border-white/8 rounded-xl p-6 h-40 animate-pulse"
              />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-navy-light border border-white/8 rounded-xl p-12 text-center">
            <p className="text-text-muted text-sm mb-4">
              No reviews cached yet. Make sure your Google Places API key and
              Place ID are configured in <code>.env.local</code>.
            </p>
            <Button onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-1" />
              )}
              Fetch Reviews Now
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((review, i) => (
              <div
                key={i}
                className="bg-navy-light border border-white/8 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {review.authorPhoto ? (
                      <img
                        src={review.authorPhoto}
                        alt={review.authorName}
                        className="w-9 h-9 rounded-full"
                      />
                    ) : (
                      <div className="w-9 h-9 bg-accent-blue/12 rounded-full flex items-center justify-center text-accent-blue text-xs font-bold">
                        {review.authorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {review.authorName}
                      </div>
                      <div className="text-xs text-text-muted">
                        {review.relativeTime}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-3 h-3 ${
                          j < review.rating
                            ? "text-amber fill-amber"
                            : "text-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
