"use client";

import Link from "next/link";

const footerLinks = [
  { href: "#booking", label: "Dates" },
  { href: "#pricing", label: "Pricing" },
  { href: "#course", label: "Course" },
  { href: "#councils", label: "Councils" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-navy px-[5%] py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-wrap">
        <Link
          href="#hero"
          className="text-base font-extrabold text-white no-underline"
        >
          Cabbie<span className="text-accent-blue">Training</span>
        </Link>

        <ul className="flex gap-5 flex-wrap list-none">
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

        <p className="text-white/28 text-xs">
          © {new Date().getFullYear()} Cabbie Training · Rochford, Essex
        </p>
      </div>
    </footer>
  );
}
