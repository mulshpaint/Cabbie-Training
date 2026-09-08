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
    question: "How do I book a place?",
    answer:
      "Give us a call or send an email — that's it. We'll talk you through what's involved, answer any questions, and get you booked in. No online forms to fill out.",
  },
  {
    question: "Is your course accepted by my council?",
    answer:
      "We're accepted by 20+ councils across Essex including Southend-on-Sea, Chelmsford, Basildon, Thurrock, Castle Point, Rochford, Maldon, Braintree, Colchester and more. Not sure? Contact us and we'll confirm before you book.",
  },
  {
    question: "How much does it cost?",
    answer:
      "£75 per person, all in. That covers the accredited course, all materials, and your certificate — there's nothing extra to pay.",
  },
  {
    question: "Do I get my certificate on the same day?",
    answer:
      "Yes — issued on the day. Take it straight to your council or use it for your renewal immediately.",
  },
  {
    question: "What do I need to bring?",
    answer:
      "Just yourself and photo ID. All materials are provided. We'll send full joining instructions once your place is confirmed.",
  },
  {
    question: "Can you work around my shifts?",
    answer:
      "We'll do our best. Get in touch and let us know what suits you — we'll find something that works.",
  },
  {
    question: "How do I pay?",
    answer:
      "We'll arrange payment with you when we confirm your booking. Just call or email and we'll explain the options.",
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
