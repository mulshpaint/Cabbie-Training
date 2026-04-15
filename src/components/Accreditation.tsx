"use client";

import { Award, CheckCircle2, GraduationCap, ShieldCheck } from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import { motion } from "framer-motion";
import Image from "next/image";

const credentials = [
  {
    icon: ShieldCheck,
    title: "Total Training UK Partnership",
    desc: "Training delivered in partnership with Total Training UK, ensuring professional standards and industry recognition.",
  },
  {
    icon: Award,
    title: "Fully Accredited Programme",
    desc: "Approved by relevant governing bodies with comprehensive coverage of disability awareness requirements.",
  },
  {
    icon: GraduationCap,
    title: "RoSPA Assured",
    desc: "The driver training element is RoSPA assured, providing additional quality assurance and credibility.",
  },
];

export default function Accreditation() {
  return (
    <SectionWrapper id="accreditation" className="py-20 bg-navy">
      <div className="max-w-7xl mx-auto px-[5%]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <div className="text-xs font-bold tracking-[2px] uppercase text-accent-blue mb-2">
            Accreditation
          </div>
          <h2 className="text-[clamp(1.6rem,3vw,2.3rem)] font-extrabold leading-tight tracking-tight text-white mb-3">
            Professionally accredited training
          </h2>
          <p className="text-text-muted text-[0.975rem] leading-relaxed max-w-[520px] mx-auto">
            Our training meets the highest industry standards with full
            accreditation and professional partnerships.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {credentials.map((cred, idx) => (
            <motion.div
              key={cred.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="bg-navy-light border border-white/8 rounded-2xl p-6 h-full hover:border-accent-blue/40 transition-all">
                <div className="w-12 h-12 bg-accent-blue/10 rounded-xl flex items-center justify-center text-accent-blue mb-4">
                  <cred.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {cred.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {cred.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-accent-blue/5 border border-accent-blue/20 rounded-2xl overflow-hidden"
        >
          {/* Partner header strip */}
          <div className="flex flex-col sm:flex-row items-center sm:items-stretch border-b border-accent-blue/15">
            <div className="flex items-center justify-center px-8 py-5 bg-white/[0.03] border-b sm:border-b-0 sm:border-r border-accent-blue/15 min-w-[220px]">
              <div className="flex flex-col items-center gap-2">
                <p className="text-white/40 text-[0.6rem] font-bold tracking-[0.15em] uppercase">
                  Official Training Partner
                </p>
                <Image
                  src="/total training uk.svg"
                  alt="Total Training UK"
                  width={150}
                  height={50}
                  className="brightness-0 invert opacity-80"
                />
              </div>
            </div>
            <div className="flex-1 flex items-center gap-4 px-8 py-6">
              <CheckCircle2 className="w-5 h-5 text-accent-blue flex-shrink-0" />
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  Why accreditation matters
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  Our accredited training ensures your certificate is recognized by councils 
                  across the UK. The programme has been enhanced to provide more comprehensive 
                  coverage of disability awareness than standard courses, and the RoSPA assurance 
                  on the driver training element gives you confidence that you&apos;re receiving 
                  quality, professional instruction that meets all regulatory requirements.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
