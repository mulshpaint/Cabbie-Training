"use client";

import Link from "next/link";

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
    <footer className="bg-navy border-t border-white/8 pt-10 pb-6">
      <div className="max-w-7xl mx-auto w-full px-[5%]">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
        {/* Brand */}
        <div>
          <Link href="#hero" className="text-base font-extrabold text-white no-underline">
            Cabbie<span className="text-accent-blue">Training</span>
          </Link>
          <p className="text-white/40 text-xs mt-2 leading-relaxed">
            Accredited PAT training for Essex taxi & private hire drivers.
            Certificate issued on the day.
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="text-white/30 text-[0.65rem] font-bold tracking-widest uppercase mb-3">Navigation</p>
          <ul className="flex flex-col gap-2 list-none">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/40 text-xs no-underline hover:text-accent-blue transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-white/30 text-[0.65rem] font-bold tracking-widest uppercase mb-3">Contact</p>
          <div className="flex flex-col gap-2">
            <a href="tel:07739320050" className="text-white/40 text-xs hover:text-accent-blue transition-colors no-underline">
              📞 07739 320050
            </a>
            <a href="mailto:info@cabbietraining.co.uk" className="text-white/40 text-xs hover:text-accent-blue transition-colors no-underline">
              ✉ info@cabbietraining.co.uk
            </a>
            <p className="text-white/30 text-xs">
              📍 Cottis House, Rochford, Essex SS4 1BB
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 pt-5">
        <p className="text-white/25 text-xs">
          © {new Date().getFullYear()} Cabbie Training · Rochford, Essex · All rights reserved
        </p>
      </div>
      </div>
    </footer>
  );
}
