"use client";

import { MapPin, PlusCircle } from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import Link from "next/link";

const councils = [
  "Southend-on-Sea",
  "Chelmsford",
  "Basildon",
  "Thurrock",
  "Castle Point",
  "Rochford",
  "Maldon",
  "Braintree",
  "Colchester",
  "Tendring",
  "Uttlesford",
  "Epping Forest",
  "Harlow",
  "Brentwood",
  "Medway",
  "Dartford",
  "Gravesham",
  "Swale",
  "London Boroughs*",
];

export default function Councils() {
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
        <div className="text-right">
          <div className="text-5xl font-extrabold text-accent-blue leading-none tracking-tight">
            20+
          </div>
          <div className="text-xs text-text-muted">councils accepted</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
        {councils.map((council) => (
          <div
            key={council}
            className="bg-navy-light border border-white/8 rounded-lg px-3.5 py-2.5 flex items-center gap-2 text-sm font-medium text-text-primary transition-all hover:border-accent-blue hover:text-accent-blue"
          >
            <MapPin className="w-3.5 h-3.5 text-accent-blue flex-shrink-0" />
            {council}
          </div>
        ))}
        <div className="bg-navy-light border border-white/8 rounded-lg px-3.5 py-2.5 flex items-center gap-2 text-sm font-medium text-text-primary transition-all hover:border-accent-blue hover:text-accent-blue">
          <PlusCircle className="w-3.5 h-3.5 text-accent-blue flex-shrink-0" />
          + More
        </div>
      </div>

      <p className="mt-4 text-[0.8rem] text-text-muted italic">
        * Selected London boroughs — confirm with your licensing authority
        before booking.{" "}
        <Link href="#contact" className="text-accent-blue hover:underline">
          Ask us to check.
        </Link>
      </p>
    </SectionWrapper>
  );
}
