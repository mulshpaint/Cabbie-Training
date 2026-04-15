"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionWrapper from "./SectionWrapper";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Is your course accepted by my council?",
    answer:
      "We're accepted by 20+ councils across Essex including Southend-on-Sea, Chelmsford, Basildon, Thurrock, Castle Point, Rochford, Maldon, Braintree, Colchester and more. Not sure? Contact us and we'll confirm before you book.",
  },
  {
    question: "How long is the course?",
    answer:
      "Around 4 hours. Covers both theory and hands-on practical training.",
  },
  {
    question: "Do I get my certificate on the same day?",
    answer:
      "Yes — issued on the day. Take it straight to your council or use it for your renewal immediately.",
  },
  {
    question: "Can I pick my own date?",
    answer:
      'Yes. Our flexible option (£95) lets you request any date that suits. Select "Flexible Date" when you book.',
  },
  {
    question: "What do I need to bring?",
    answer:
      "Just yourself and photo ID. All materials are provided. We'll send full joining instructions when you confirm.",
  },
  {
    question: "How do I pay?",
    answer:
      "You'll be directed to our secure Stripe checkout after submitting your booking. Card payments accepted. Nothing taken until your place is confirmed.",
  },
];

export default function FAQ() {
  return (
    <SectionWrapper id="faq" className="py-20 bg-navy-light">
      <div className="max-w-7xl mx-auto px-[5%]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="text-xs font-bold tracking-[2px] uppercase text-accent-blue mb-2">
          FAQ
        </div>
        <h2 className="text-[clamp(1.6rem,3vw,2.3rem)] font-extrabold leading-tight tracking-tight text-white mb-3">
          Common questions
        </h2>
        <p className="text-text-muted text-[0.975rem] leading-relaxed max-w-[520px] mx-auto mb-10">
          Quick answers before you book.
        </p>
      </motion.div>

      <div className="max-w-[720px] mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-b border-white/8"
            >
              <AccordionTrigger className="text-white font-semibold text-[0.95rem] text-left hover:text-accent-blue py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-text-muted text-sm leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      </div>
    </SectionWrapper>
  );
}
