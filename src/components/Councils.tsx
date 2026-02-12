"use client";

import { useEffect, useState } from "react";
import { MapPin, PlusCircle } from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import Link from "next/link";

interface Council {
  _id: string;
  name: string;
  displayName: string;
  note?: string;
}

export default function Councils() {
  const [councils, setCouncils] = useState<Council[]>([]);

  useEffect(() => {
    async function fetchCouncils() {
      try {
        const res = await fetch("/api/councils");
        if (res.ok) {
          const data = await res.json();
          setCouncils(data);
        }
      } catch {
        // Silently fail — section just won't show councils
      }
    }
    fetchCouncils();
  }, []);

  const hasNotes = councils.some((c) => c.note);

  return (
    <SectionWrapper id="councils" className="px-[5%] py-20 bg-navy-light">
      <div className="flex justify-between items-end gap-8 flex-wrap mb-8">
        <div>
          <div className="text-xs font-bold tracking-[2px] uppercase text-accent-blue mb-2">
            Accepted By
          </div>
          <h2 className="text-[clamp(1.6rem,3vw,2.3rem)] font-extrabold leading-tight tracking-tight text-white mb-3">
            Which councils accept our certificate?
          </h2>
          <p className="text-text-muted text-[0.975rem] leading-relaxed max-w-[520px]">
            Not sure about yours?{" "}
            <Link
              href="#contact"
              className="text-accent-blue hover:underline"
            >
              Get in touch and we&apos;ll confirm.
            </Link>
          </p>
        </div>
        {councils.length > 0 && (
          <div className="text-right">
            <div className="text-5xl font-extrabold text-accent-blue leading-none tracking-tight">
              {councils.length}+
            </div>
            <div className="text-xs text-text-muted">councils accepted</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
        {councils.map((council) => (
          <div
            key={council._id}
            className="bg-navy-light border border-white/8 rounded-lg px-3.5 py-2.5 flex items-center gap-2 text-sm font-medium text-text-primary transition-all hover:border-accent-blue hover:text-accent-blue"
          >
            <MapPin className="w-3.5 h-3.5 text-accent-blue flex-shrink-0" />
            {council.name}
          </div>
        ))}
        <div className="bg-navy-light border border-white/8 rounded-lg px-3.5 py-2.5 flex items-center gap-2 text-sm font-medium text-text-primary transition-all hover:border-accent-blue hover:text-accent-blue">
          <PlusCircle className="w-3.5 h-3.5 text-accent-blue flex-shrink-0" />
          + More
        </div>
      </div>

      {hasNotes && (
        <p className="mt-4 text-[0.8rem] text-text-muted italic">
          {councils
            .filter((c) => c.note)
            .map((c) => `* ${c.note}`)
            .join(". ")}
          .{" "}
          <Link href="#contact" className="text-accent-blue hover:underline">
            Ask us to check.
          </Link>
        </p>
      )}
    </SectionWrapper>
  );
}
