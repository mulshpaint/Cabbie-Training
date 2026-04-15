"use client";

import { Award, MapPin, Users } from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import { motion } from "framer-motion";

export default function About() {
  return (
    <SectionWrapper id="about" className="py-20 bg-navy-light">
      <div className="max-w-7xl mx-auto px-[5%]">
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
        className="max-w-5xl mx-auto"
      >
        <div className="bg-navy border border-white/8 rounded-2xl p-8 lg:p-10 shadow-lg">
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
                Wendy has been a licensed taxi driver in Southend-on-Sea since 2000, 
                including 16 years working specifically as a disability driver. This 
                extensive practical experience provides her with deep, real-world 
                knowledge of both the transport industry and the needs of passengers 
                with disabilities.
              </p>
              <p className="text-text-muted text-sm leading-relaxed mb-5">
                Since 2012, Wendy has been delivering Disability Awareness and 
                Passenger Assistance Training, initially in partnership with the 
                Community Transport Association. Following their transition to online 
                delivery, she established an in-person training alternative because 
                she strongly believes face-to-face training is essential—particularly 
                for practical elements like wheelchair handling and safe securing 
                procedures, which cannot be effectively taught online.
              </p>
              <p className="text-text-muted text-sm leading-relaxed mb-5">
                Her current training is delivered in partnership with Total Training UK. 
                The programme is fully accredited, approved by relevant governing bodies, 
                and has been enhanced to provide comprehensive disability awareness 
                coverage. The driver training element is RoSPA assured, giving drivers 
                confidence in the quality and recognition of their certification.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Award className="w-4 h-4 text-accent-blue" />
                  13+ years training experience
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <MapPin className="w-4 h-4 text-accent-blue" />
                  24+ years licensed taxi driver
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
      </div>
    </SectionWrapper>
  );
}
