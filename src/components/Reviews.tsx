"use client";

import { useEffect, useState } from "react";
import { Star, ExternalLink } from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import { motion } from "framer-motion";

interface Review {
  authorName: string;
  authorPhoto?: string;
  rating: number;
  text: string;
  relativeTime: string;
}

const fallbackReviews: Review[] = [
  {
    authorName: "Mohammed K.",
    rating: 5,
    text: "Got my certificate on the day and my council accepted it straight away. Really well run, would definitely recommend.",
    relativeTime: "2 months ago",
  },
  {
    authorName: "David P.",
    rating: 5,
    text: "Booked a flexible date and it was sorted quickly. Practical course, not just lectures. Good value for money.",
    relativeTime: "3 months ago",
  },
  {
    authorName: "Steve R.",
    rating: 5,
    text: "Easy to book, covered everything Basildon needed. Certificate accepted with no issues. Straightforward and professional.",
    relativeTime: "1 month ago",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);
  const [isGoogle, setIsGoogle] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setReviews(data);
            setIsGoogle(true);
          }
        }
      } catch {
        // Use fallback reviews
      }
    }
    fetchReviews();
  }, []);

  return (
    <SectionWrapper className="px-[5%] py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
      <div className="text-xs font-bold tracking-[2px] uppercase text-accent-blue mb-2">
        What Drivers Say
      </div>
      <h2 className="text-[clamp(1.6rem,3vw,2.3rem)] font-extrabold leading-tight tracking-tight text-white mb-3">
        Trusted by Essex drivers
      </h2>
      <p className="text-text-muted text-[0.975rem] leading-relaxed max-w-[520px] mb-10">
        Real feedback from taxi and private hire drivers who&apos;ve completed
        their PAT course with us.
      </p>
      </motion.div>

      {/* Aggregate rating */}
      <div className="inline-flex items-center gap-4 bg-navy-light border border-white/8 rounded-2xl px-6 py-4 mb-8">
        <div className="text-5xl font-extrabold text-white leading-none">5.0</div>
        <div>
          <div className="flex gap-0.5 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-amber fill-amber" />
            ))}
          </div>
          <div className="text-xs text-text-muted">Based on driver reviews</div>
        </div>
        <div className="ml-4 pl-4 border-l border-white/8">
          <div className="text-xs text-text-muted">All courses</div>
          <div className="text-sm font-bold text-white">Essex trained</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.slice(0, 6).map((review, i) => (
          <div
            key={i}
            className="relative bg-navy-light border border-white/8 rounded-xl p-6 shadow-lg transition-all hover:border-accent-blue/40 hover:-translate-y-0.5 hover:shadow-xl overflow-hidden"
          >
            <div className="absolute top-3 right-4 text-6xl font-serif text-accent-blue/10 leading-none select-none pointer-events-none">&rdquo;</div>
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  className={`w-3.5 h-3.5 ${
                    j < review.rating
                      ? "text-amber fill-amber"
                      : "text-white/20"
                  }`}
                />
              ))}
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-4 italic relative z-10">
              &ldquo;{review.text}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              {review.authorPhoto ? (
                <img
                  src={review.authorPhoto}
                  alt={review.authorName}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 bg-accent-blue/12 rounded-full flex items-center justify-center text-accent-blue text-xs font-bold">
                  {getInitials(review.authorName)}
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
          </div>
        ))}
      </div>

      {isGoogle && (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-text-muted">
          <span>Reviews from</span>
          <span className="font-bold text-white">Google</span>
          <span>·</span>
          <a
            href="https://search.google.com/local/reviews?placeid="
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-blue hover:underline inline-flex items-center gap-1"
          >
            See all reviews
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </SectionWrapper>
  );
}
