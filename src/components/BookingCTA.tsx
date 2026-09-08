"use client";

import { Phone, Mail, Check, ArrowRight, Clock, MapPin } from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import { motion } from "framer-motion";

const included = [
  "Accredited PAT course",
  "In-person, hands-on training",
  "Certificate issued on the day",
  "All materials provided",
  "Accepted by councils across Essex",
  "No hidden fees",
];

export default function BookingCTA() {
  return (
    <SectionWrapper id="book" className="py-20 bg-navy-light">
      <div className="max-w-7xl mx-auto px-[5%]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-[560px] mx-auto mb-12"
        >
          <div className="text-xs font-bold tracking-[2px] uppercase text-accent-blue mb-2">
            Booking
          </div>
          <h2 className="text-[clamp(1.6rem,3vw,2.3rem)] font-extrabold leading-tight tracking-tight text-white mb-3">
            One price. Book in a minute.
          </h2>
          <p className="text-text-muted text-[0.975rem] leading-relaxed">
            Give us a call or drop us an email and we&apos;ll sort the rest —
            we&apos;ll find a time that works around your shifts.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-[880px] mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden border-2 border-accent-blue/40 bg-gradient-to-b from-accent-blue/[0.09] to-navy-light shadow-2xl shadow-accent-blue/10">
            {/* Soft corner glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 70% at 15% 0%, rgba(56,189,248,0.14) 0%, transparent 65%)",
              }}
            />

            <div className="relative grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-0">
              {/* Left — price & what's included */}
              <div className="p-8 lg:p-10">
                <div className="text-[0.65rem] font-bold tracking-widest uppercase text-text-muted mb-2">
                  Passenger Assistance Training
                </div>
                <div className="flex items-end gap-2.5 mb-1">
                  <div className="text-6xl font-extrabold text-white leading-none tracking-tight">
                    <sup className="text-2xl align-super font-bold">£</sup>75
                  </div>
                  <div className="text-sm text-text-muted pb-1.5 font-medium">
                    per person
                  </div>
                </div>
                <p className="text-text-muted text-sm mb-7">
                  Everything included — nothing extra to pay.
                </p>

                <ul className="space-y-2.5">
                  {included.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-text-primary"
                    >
                      <span className="w-4 h-4 rounded-full bg-accent-blue/15 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-accent-blue" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Divider */}
              <div className="hidden md:block bg-white/8" />

              {/* Right — how to book */}
              <div className="p-8 lg:p-10 border-t border-white/8 md:border-t-0">
                <h3 className="text-base font-extrabold text-white mb-1.5">
                  Two ways to book
                </h3>
                <p className="text-text-muted text-[0.85rem] leading-relaxed mb-6">
                  No online forms to fight with. Talk to Wendy directly and
                  she&apos;ll confirm your place.
                </p>

                <div className="space-y-3">
                  <a
                    href="tel:07739320050"
                    className="group flex items-center gap-4 rounded-xl border border-white/10 bg-navy px-4 py-4 no-underline transition-all hover:border-accent-blue hover:bg-navy/60 hover:shadow-lg hover:shadow-accent-blue/10"
                  >
                    <div className="w-10 h-10 min-w-[40px] rounded-xl bg-accent-blue/15 flex items-center justify-center text-accent-blue">
                      <Phone className="w-[18px] h-[18px]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[0.65rem] font-bold tracking-widest uppercase text-text-muted mb-0.5">
                        Call or WhatsApp
                      </div>
                      <div className="text-[0.95rem] font-extrabold text-white truncate">
                        07739 320050
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted ml-auto flex-shrink-0 transition-all group-hover:text-accent-blue group-hover:translate-x-0.5" />
                  </a>

                  <a
                    href="mailto:info@cabbietraining.co.uk?subject=PAT%20Course%20Booking"
                    className="group flex items-center gap-4 rounded-xl border border-white/10 bg-navy px-4 py-4 no-underline transition-all hover:border-accent-blue hover:bg-navy/60 hover:shadow-lg hover:shadow-accent-blue/10"
                  >
                    <div className="w-10 h-10 min-w-[40px] rounded-xl bg-accent-blue/15 flex items-center justify-center text-accent-blue">
                      <Mail className="w-[18px] h-[18px]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[0.65rem] font-bold tracking-widest uppercase text-text-muted mb-0.5">
                        Email us
                      </div>
                      <div className="text-[0.95rem] font-extrabold text-white truncate">
                        info@cabbietraining.co.uk
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted ml-auto flex-shrink-0 transition-all group-hover:text-accent-blue group-hover:translate-x-0.5" />
                  </a>
                </div>

                <div className="mt-6 pt-5 border-t border-white/8 space-y-2.5">
                  <div className="flex items-start gap-2.5 text-xs text-text-muted leading-relaxed">
                    <Clock className="w-3.5 h-3.5 text-accent-blue flex-shrink-0 mt-0.5" />
                    <span>
                      Lines open{" "}
                      <strong className="text-text-primary font-semibold">
                        Mon–Sat, 8am–6pm
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-text-muted leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-accent-blue flex-shrink-0 mt-0.5" />
                    <span>
                      Training centre in{" "}
                      <strong className="text-text-primary font-semibold">
                        Rochford, Essex
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
