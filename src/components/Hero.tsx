"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
  { value: "20+", label: "Councils accepting\nour certificate" },
  { value: "~4hrs", label: "Course duration —\npractical & focused" },
  { value: "Same day", label: "Certificate issued\non the day" },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative bg-navy pt-28 pb-20 px-[5%] overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_70%_at_80%_50%,rgba(14,165,233,0.08)_0%,transparent_65%)]" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-[640px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 bg-accent-blue/15 border border-accent-blue/30 text-accent-blue text-[0.7rem] font-bold tracking-widest uppercase px-3.5 py-1 rounded-full mb-5"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Essex PAT Training
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[clamp(2.1rem,5vw,3.6rem)] font-extrabold leading-[1.08] tracking-tight text-white mb-4"
        >
          Get Your PAT
          <br />
          Certificate <strong className="text-accent-blue">Fast</strong>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base text-white/60 max-w-[480px] mb-8 leading-relaxed"
        >
          In-person Passenger Assistance Training at our Essex training centre.
          Accredited course for taxi and private hire drivers — book a date, get
          your certificate the same day.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-3 flex-wrap"
        >
          <Button asChild size="lg" className="font-bold shadow-lg shadow-accent-blue/30">
            <Link href="#booking">
              <Calendar className="w-4 h-4 mr-1" />
              See Dates & Book
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-white/10 border-white/20 text-white hover:bg-white/[0.18] hover:border-white/40 hover:text-white font-bold"
          >
            <Link href="#pricing">
              View Pricing
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex gap-10 mt-12 flex-wrap pt-10 border-t border-white/10"
        >
          {stats.map((stat) => (
            <div key={stat.value}>
              <div className="text-3xl font-extrabold text-accent-blue leading-none tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs text-white/50 mt-1 leading-snug whitespace-pre-line">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
