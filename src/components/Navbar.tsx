"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu, X, Settings, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { href: "#booking", label: "Dates & Booking" },
  { href: "#pricing", label: "Pricing" },
  { href: "#course", label: "Course" },
  { href: "#councils", label: "Councils" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
        scrolled
          ? "bg-navy/97 backdrop-blur-lg border-b border-white/8 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-[5%] h-full flex items-center justify-between">
      <Link
        href="#hero"
        className="flex items-center gap-1.5 text-lg font-extrabold text-white tracking-tight"
      >
        <ShieldCheck className="w-5 h-5 text-accent-blue" />
        Cabbie<span className="text-accent-blue">Training</span>
      </Link>

      {/* Desktop nav */}
      <ul className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-text-muted text-sm font-medium hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <Button asChild size="sm" className="font-bold">
            <Link href="#booking">Book Now</Link>
          </Button>
        </li>
        {session && (
          <li>
            <Link
              href="/admin/dashboard"
              className="p-2 rounded-lg text-text-muted hover:text-accent-blue hover:bg-white/5 transition-colors"
              title="Admin"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </li>
        )}
      </ul>

      {/* Mobile nav */}
      {mounted && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="top"
            className="bg-navy-light border-b border-white/8 pt-16"
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-1 px-2 pb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 px-3 text-text-primary font-medium border-b border-white/8 hover:text-accent-blue transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Button
                asChild
                className="mt-4 w-full font-bold"
                onClick={() => setOpen(false)}
              >
                <Link href="#booking">Book a Course →</Link>
              </Button>
              {session && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 mt-2 py-3 px-3 text-text-muted font-medium hover:text-accent-blue transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
      </div>
    </nav>
  );
}
