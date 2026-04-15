"use client";

import { Award, MapPin, Users } from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import { motion } from "framer-motion";

export default function About() {
  return (
    <SectionWrapper id="about" className="px-[5%] py-20 bg-navy-light">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="text-xs font-bold tracking-[2px] uppercase text-accent-blue mb-2">
          About Us
        </div>
        <h2 className="text-[clamp(1.6rem,3vw,2.3rem)] font-extrabold leading-tight tracking-tight text-white mb-3">
          Meet your trainer
        </h2>
        <p className="text-text-muted text-[0.975rem] leading-relaxed max-w-[520px] mx-auto mb-10">
          Professional, accredited training delivered by an experienced
          instructor who understands what drivers need.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-navy border border-white/8 rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 min-w-[80px] rounded-full flex items-center justify-center text-white text-2xl font-extrabold ring-2 ring-accent-blue/40 shadow-lg shadow-accent-blue/20"
              style={{ background: "linear-gradient(135deg, #1e3a6e 0%, #0ea5e9 100%)" }}
            >
              WC
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-extrabold text-white mb-1">
                Wendy Clarke
              </h3>
              <p className="text-accent-blue text-sm font-semibold mb-3">
                Lead PAT Instructor
              </p>
              <p className="text-text-muted text-sm leading-relaxed mb-5">
                Wendy has been delivering Passenger Assistance Training across
                Essex for years, helping hundreds of taxi and private hire
                drivers gain their accredited PAT certificate. Her courses are
                practical, engaging, and focused on giving drivers exactly what
                they need to meet council requirements and provide excellent
                service to all passengers.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Award className="w-4 h-4 text-accent-blue" />
                  Accredited Instructor
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <MapPin className="w-4 h-4 text-accent-blue" />
                  Rochford, Essex
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Users className="w-4 h-4 text-accent-blue" />
                  Hundreds of drivers trained
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
