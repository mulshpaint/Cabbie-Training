"use client";

import {
  Clock,
  HeartHandshake,
  Hand,
  Accessibility,
  Scale,
  MessageCircle,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionWrapper from "./SectionWrapper";
import Link from "next/link";
import { motion } from "framer-motion";

const modules = [
  {
    icon: Clock,
    title: "Duration",
    desc: "Around 4 hours, practical and focused",
  },
  {
    icon: HeartHandshake,
    title: "Disability Awareness",
    desc: "Understanding different disabilities and their effects",
  },
  {
    icon: Hand,
    title: "Practical Techniques",
    desc: "Hands-on — safely assist passengers in and out of vehicles",
  },
  {
    icon: Accessibility,
    title: "Mobility Aids",
    desc: "Wheelchairs, walking frames, and mobility equipment",
  },
  {
    icon: Scale,
    title: "Legal Requirements",
    desc: "Your duties under the Equality Act",
  },
  {
    icon: MessageCircle,
    title: "Communication",
    desc: "Respectful, effective communication with all passengers",
  },
];

export default function CourseContent() {
  return (
    <SectionWrapper id="course" className="px-[5%] py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xs font-bold tracking-[2px] uppercase text-accent-blue mb-2">
            The Course
          </div>
          <h2 className="text-[clamp(1.6rem,3vw,2.3rem)] font-extrabold leading-tight tracking-tight text-white mb-3">
            What&apos;s covered
          </h2>
          <p className="text-text-muted text-[0.975rem] leading-relaxed max-w-[520px] mb-6">
            Everything your council needs, delivered in around 4 hours.
            Practical and focused — no unnecessary filler.
          </p>
          <Button asChild className="font-bold">
            <Link href="#booking">
              <Calendar className="w-4 h-4 mr-1" />
              Book Your Place
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="border border-white/8 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-navy px-6 py-4 text-[0.68rem] font-bold tracking-widest uppercase text-white/60">
              Course Overview
            </div>
            {modules.map((mod) => (
              <div
                key={mod.title}
                className="flex items-start gap-3.5 px-6 py-4 border-b border-white/8 last:border-b-0 bg-navy-light"
              >
                <div className="w-8 h-8 min-w-[32px] bg-accent-blue/10 rounded-lg flex items-center justify-center text-accent-blue">
                  <mod.icon className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-sm font-semibold text-white mb-0.5">
                    {mod.title}
                  </strong>
                  <span className="text-[0.8rem] text-text-muted leading-relaxed">
                    {mod.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-navy rounded-xl px-5 py-4 flex items-center gap-3.5">
            <GraduationCap className="w-7 h-7 text-accent-blue flex-shrink-0" />
            <div>
              <strong className="block text-sm font-bold text-white mb-0.5">
                PAT Certificate Issued on the Day
              </strong>
              <span className="text-xs text-white/55">
                Accredited & accepted for your Essex licence renewal
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
