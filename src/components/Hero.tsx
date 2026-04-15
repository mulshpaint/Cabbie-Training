"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Calendar, ArrowRight, GraduationCap, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Hero() {
  const [councilCount, setCouncilCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCouncilCount = async () => {
      try {
        const res = await fetch("/api/councils");
        if (res.ok) {
          const councils = await res.json();
          setCouncilCount(councils.length);
        }
      } catch (error) {
        console.error("Failed to fetch council count:", error);
      }
    };

    fetchCouncilCount();
  }, []);

  const stats = [
    {
      value: councilCount ? `${councilCount}+` : "20+",
      label: "Councils accepting\nour certificate",
    },
    { value: "~4hrs", label: "Course duration —\npractical & focused" },
    { value: "Same day", label: "Certificate issued\non the day" },
  ];

  return (
    <section
      id="hero"
      className="relative bg-navy pt-28 pb-20 overflow-hidden"
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

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center max-w-7xl mx-auto w-full px-[5%]">
        {/* Left — content */}
        <div>
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
            In-person, hands-on Passenger Assistance Training at our Essex training 
            centre. Face-to-face instruction for practical skills like wheelchair 
            handling and safe securing—essential techniques that can&apos;t be taught 
            online. Book a date, get your accredited certificate the same day.
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

        {/* Right — decorative certificate card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="hidden lg:block"
        >
          <div className="relative w-[300px]">
            {/* Glow */}
            <div className="absolute -inset-4 rounded-3xl bg-accent-blue/10 blur-2xl pointer-events-none" />

            {/* Certificate card */}
            <div className="relative bg-navy-light border border-accent-blue/25 rounded-2xl p-6 shadow-2xl shadow-black/40">
              {/* Header bar */}
              <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-white/8">
                <div className="w-9 h-9 rounded-xl bg-accent-blue/15 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-accent-blue" />
                </div>
                <div>
                  <div className="text-[0.65rem] font-bold tracking-widest uppercase text-accent-blue">Certificate</div>
                  <div className="text-sm font-extrabold text-white">PAT Training</div>
                </div>
                <div className="ml-auto">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.5)]" />
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-3 mb-5">
                {[
                  "Disability awareness",
                  "Practical techniques",
                  "Mobility aid assistance",
                  "Equality Act obligations",
                  "Communication skills",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-blue flex-shrink-0" />
                    <span className="text-xs text-text-muted">{item}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="bg-navy rounded-xl px-4 py-3 flex items-center gap-3">
                <Clock className="w-4 h-4 text-accent-blue flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">~4 hours</div>
                  <div className="text-[0.65rem] text-text-muted">Certificate same day</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xs font-bold text-white">£75</div>
                  <div className="text-[0.65rem] text-text-muted">from</div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-emerald-500 text-white text-[0.6rem] font-extrabold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/30"
            >
              ✓ Accredited
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
