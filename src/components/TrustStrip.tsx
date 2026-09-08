"use client";

import { Award, ShieldCheck, Clock, PoundSterling } from "lucide-react";

const items = [
  {
    icon: Award,
    text: "Accredited PAT course",
  },
  {
    icon: ShieldCheck,
    text: "Councils across Essex accepted",
  },
  {
    icon: Clock,
    text: "Certificate same day",
  },
  {
    icon: PoundSterling,
    text: "£75 — all inclusive",
  },
];

export default function TrustStrip() {
  return (
    <div className="bg-navy-light border-y border-white/8 py-3.5">
      <div className="max-w-7xl mx-auto px-[5%]">
      <div className="flex items-center justify-center gap-6 flex-wrap">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
            <item.icon className="w-3.5 h-3.5 flex-shrink-0 text-accent-blue" />
            {item.text}
            {i < items.length - 1 && (
              <span className="ml-6 hidden sm:inline text-white/15">|</span>
            )}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
