"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";

const contactMethods = [
  {
    icon: Phone,
    label: "Call or WhatsApp",
    value: "07739 320050",
    note: "Mon–Sat, 8am–6pm",
    href: "tel:07739320050",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@cabbietraining.co.uk",
    note: "We'll reply the same day where we can",
    href: "mailto:info@cabbietraining.co.uk?subject=PAT%20Course%20Enquiry",
  },
  {
    icon: MapPin,
    label: "Training centre",
    value: "Rochford, Essex",
    note: "Cottis House, Locks Hills, South Street, SS4 1BB",
    href: null,
  },
];

export default function Contact() {
  return (
    <SectionWrapper id="contact" className="py-20">
      <div className="max-w-7xl mx-auto px-[5%]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-[560px] mx-auto mb-10"
        >
          <div className="text-xs font-bold tracking-[2px] uppercase text-accent-blue mb-2">
            Get in Touch
          </div>
          <h2 className="text-[clamp(1.6rem,3vw,2.3rem)] font-extrabold leading-tight tracking-tight text-white mb-3">
            Ready when you are
          </h2>
          <p className="text-text-muted text-[0.975rem] leading-relaxed">
            Book a place, check your council accepts our certificate, or just
            ask a question — Wendy will pick up.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[980px] mx-auto"
        >
          {contactMethods.map((method) => {
            const Wrapper = method.href ? "a" : "div";
            return (
              <Wrapper
                key={method.label}
                {...(method.href ? { href: method.href } : {})}
                className={`flex flex-col items-center text-center gap-3 rounded-2xl border border-white/8 bg-navy-light px-6 py-8 no-underline transition-all ${
                  method.href
                    ? "hover:border-accent-blue hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent-blue/10"
                    : ""
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                  <method.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[0.65rem] font-bold tracking-widest uppercase text-text-muted mb-1.5">
                    {method.label}
                  </div>
                  <div className="text-[0.95rem] font-extrabold text-white mb-1.5 break-words">
                    {method.value}
                  </div>
                  <div className="text-xs text-text-muted leading-relaxed">
                    {method.note}
                  </div>
                </div>
              </Wrapper>
            );
          })}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
