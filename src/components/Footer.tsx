"use client";

import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  { href: "#booking", label: "Dates" },
  { href: "#pricing", label: "Pricing" },
  { href: "#course", label: "Course" },
  { href: "#councils", label: "Councils" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
];

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-white/8 pt-12 pb-6">
      <div className="max-w-7xl mx-auto w-full px-[5%]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link href="#hero" className="text-base font-extrabold text-white no-underline inline-block mb-3">
              Cabbie<span className="text-accent-blue">Training</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              Accredited PAT training for Essex taxi & private hire drivers.
              Certificate issued on the day.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-white/40 text-[0.7rem] font-bold tracking-[0.1em] uppercase mb-4">
              Quick Links
            </p>
            <ul className="flex flex-col gap-2.5 list-none">
              {footerLinks.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 text-sm no-underline hover:text-accent-blue transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white/40 text-[0.7rem] font-bold tracking-[0.1em] uppercase mb-4">
              Get in Touch
            </p>
            <div className="flex flex-col gap-3">
              <a 
                href="tel:07739320050" 
                className="text-white/50 text-sm hover:text-accent-blue transition-colors no-underline flex items-start gap-2"
              >
                <span className="text-base">📞</span>
                <span>07739 320050</span>
              </a>
              <a 
                href="mailto:info@cabbietraining.co.uk" 
                className="text-white/50 text-sm hover:text-accent-blue transition-colors no-underline flex items-start gap-2"
              >
                <span className="text-base">✉</span>
                <span>info@cabbietraining.co.uk</span>
              </a>
              <p className="text-white/40 text-sm flex items-start gap-2">
                <span className="text-base">📍</span>
                <span>Cottis House, Rochford,<br />Essex SS4 1BB</span>
              </p>
            </div>
          </div>

          {/* Accreditation */}
          <div>
            <p className="text-white/40 text-[0.7rem] font-bold tracking-[0.1em] uppercase mb-4">
              Accredited By
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-accent-blue/30 transition-colors">
              <Image
                src="/total training uk.svg"
                alt="Total Training UK - Accredited Training Provider"
                width={160}
                height={55}
                className="w-full h-auto brightness-0 invert opacity-70"
              />
            </div>
            <p className="text-white/30 text-xs mt-3 leading-relaxed">
              Official training partner delivering professional PAT certification
            </p>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Cabbie Training · All rights reserved
          </p>
          <div className="flex gap-4">
            <Link 
              href="/privacy-policy"
              className="text-white/30 text-xs hover:text-accent-blue transition-colors no-underline"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/cookie-policy"
              className="text-white/30 text-xs hover:text-accent-blue transition-colors no-underline"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
