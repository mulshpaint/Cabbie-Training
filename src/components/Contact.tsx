"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Phone, Mail, MapPin, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import SectionWrapper from "./SectionWrapper";
import { toast } from "sonner";
import Link from "next/link";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  privacyConsent: boolean;
}

const contactMethods = [
  {
    icon: Phone,
    title: "Phone / WhatsApp",
    detail: "07739 320050 · Mon–Sat, 8am–6pm",
    href: "tel:07739320050",
  },
  {
    icon: Mail,
    title: "Email",
    detail: "info@cabbietraining.co.uk",
    href: "mailto:info@cabbietraining.co.uk",
  },
  {
    icon: MapPin,
    title: "Location",
    detail: "Cottis House, Locks Hills, South Street, Rochford, Essex, SS4 1BB",
    href: null,
  },
];

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  register("privacyConsent", { validate: (v) => v === true || "You must agree to the Privacy Policy" });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Message sent! We'll get back to you shortly.");
        reset();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SectionWrapper id="contact" className="px-[5%] py-20">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
        <div>
          <div className="text-xs font-bold tracking-[2px] uppercase text-accent-blue mb-2">
            Get in Touch
          </div>
          <h2 className="text-[clamp(1.6rem,3vw,2.3rem)] font-extrabold leading-tight tracking-tight text-white mb-3">
            Any questions?
          </h2>
          <p className="text-text-muted text-[0.925rem] leading-relaxed mb-6">
            Whether you want to check your council accepts our cert, ask about a
            date, or anything else — we&apos;re happy to help.
          </p>

          <div className="flex flex-col gap-3">
            {contactMethods.map((method) => {
              const Wrapper = method.href ? "a" : "div";
              return (
                <Wrapper
                  key={method.title}
                  {...(method.href ? { href: method.href } : {})}
                  className="flex items-center gap-3.5 bg-navy-light border border-white/8 rounded-xl px-4 py-3.5 text-text-primary transition-all hover:border-accent-blue hover:shadow-lg hover:shadow-accent-blue/10 no-underline"
                >
                  <div className="w-9 h-9 min-w-[36px] bg-accent-blue/10 rounded-lg flex items-center justify-center text-accent-blue">
                    <method.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-[0.8rem] font-bold text-white mb-0.5">
                      {method.title}
                    </strong>
                    <span className="text-[0.8rem] text-text-muted">
                      {method.detail}
                    </span>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>

        <div className="bg-navy-light border border-white/8 rounded-2xl p-6 md:p-8 shadow-lg">
          <h3 className="text-lg font-extrabold text-white mb-5">
            Send a message
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                placeholder="Full name"
                {...register("name", { required: "Name is required" })}
                className="mt-1"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="your@email.com"
                {...register("email", { required: "Email is required" })}
                className="mt-1"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="contact-phone">Phone (optional)</Label>
              <Input
                id="contact-phone"
                type="tel"
                placeholder="07700 000000"
                {...register("phone")}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Subject</Label>
              <Select onValueChange={(val) => setValue("subject", val)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a subject…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General enquiry">
                    General enquiry
                  </SelectItem>
                  <SelectItem value="Council acceptance check">
                    Council acceptance check
                  </SelectItem>
                  <SelectItem value="Booking question">
                    Booking question
                  </SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                placeholder="How can we help?"
                {...register("message", { required: "Message is required" })}
                className="mt-1"
              />
              {errors.message && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="contact-privacy"
                onCheckedChange={(checked) =>
                  setValue("privacyConsent", checked === true, { shouldValidate: true })
                }
                className="mt-0.5"
              />
              <label htmlFor="contact-privacy" className="text-xs text-text-muted leading-relaxed cursor-pointer">
                I agree to the{" "}
                <Link href="/privacy-policy" target="_blank" className="text-accent-blue hover:underline">
                  Privacy Policy
                </Link>
                . My data will be used to respond to this enquiry.
              </label>
            </div>
            {errors.privacyConsent && (
              <p className="text-red-400 text-xs">
                {errors.privacyConsent.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full font-bold"
              size="lg"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-1" />
              )}
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </SectionWrapper>
  );
}
