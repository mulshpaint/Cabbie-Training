"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionWrapper from "./SectionWrapper";
import Link from "next/link";

const plans = [
  {
    tier: "Fixed Date",
    price: 75,
    description: "Choose from our upcoming dates",
    featured: false,
    badge: null,
    features: [
      { text: "Accredited PAT course", highlight: true },
      { text: "Certificate same day", highlight: false },
      { text: "All materials included", highlight: false },
      { text: "Essex council accepted", highlight: false },
    ],
  },
  {
    tier: "Your Own Date",
    price: 95,
    description: "Request any date that suits you",
    featured: true,
    badge: "Flexible",
    features: [
      { text: "Any date & time", highlight: true },
      { text: "Certificate same day", highlight: false },
      { text: "All materials included", highlight: false },
      { text: "Essex council accepted", highlight: false },
    ],
  },
];

export default function Pricing() {
  return (
    <SectionWrapper
      id="pricing"
      className="px-[5%] py-20 bg-navy-light"
    >
      <div className="text-xs font-bold tracking-[2px] uppercase text-accent-blue mb-2">
        Pricing
      </div>
      <h2 className="text-[clamp(1.6rem,3vw,2.3rem)] font-extrabold leading-tight tracking-tight text-white mb-3">
        Two simple options
      </h2>
      <p className="text-text-muted text-[0.975rem] leading-relaxed max-w-[520px] mb-10">
        No hidden fees. Everything included.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-[680px]">
        {plans.map((plan) => (
          <div
            key={plan.tier}
            className={`relative bg-navy-light border-2 rounded-2xl p-8 transition-all hover:-translate-y-0.5 ${
              plan.featured
                ? "border-accent-blue shadow-lg shadow-accent-blue/15"
                : "border-white/8 shadow-lg shadow-black/25 hover:shadow-xl"
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-blue text-white text-[0.65rem] font-extrabold tracking-wider uppercase px-4 py-1 rounded-full whitespace-nowrap">
                {plan.badge}
              </div>
            )}
            <div className="text-[0.65rem] font-bold tracking-widest uppercase text-text-muted mb-1">
              {plan.tier}
            </div>
            <div className="text-5xl font-extrabold text-white leading-none tracking-tight my-1.5">
              <sup className="text-lg align-super">£</sup>
              {plan.price}
            </div>
            <p className="text-text-muted text-sm mb-5">{plan.description}</p>

            <ul className="space-y-2 mb-7">
              {plan.features.map((feature) => (
                <li
                  key={feature.text}
                  className={`flex items-center gap-2 text-sm ${
                    feature.highlight
                      ? "text-white font-semibold"
                      : "text-text-muted"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 text-accent-blue flex-shrink-0" />
                  {feature.text}
                </li>
              ))}
            </ul>

            {plan.featured ? (
              <Button asChild className="w-full font-bold">
                <Link href="#booking">Book Now →</Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                className="w-full font-semibold border-white/8 text-text-primary hover:border-accent-blue hover:text-accent-blue"
              >
                <Link href="#booking">See Dates & Book</Link>
              </Button>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
