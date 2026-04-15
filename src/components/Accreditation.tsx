"use client";

import { ShieldCheck, Award, CheckCircle2, GraduationCap } from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import { motion } from "framer-motion";

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
          className="bg-accent-blue/5 border border-accent-blue/20 rounded-2xl p-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-14 h-14 min-w-[56px] bg-accent-blue/15 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-accent-blue" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
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
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
