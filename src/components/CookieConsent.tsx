"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto bg-navy-light border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 text-sm text-text-muted leading-relaxed">
          We use strictly necessary cookies to keep the site working. No
          tracking or marketing cookies are used. See our{" "}
          <Link
            href="/cookie-policy"
            className="text-accent-blue hover:underline font-medium"
          >
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="text-accent-blue hover:underline font-medium"
          >
            Privacy Policy
          </Link>{" "}
          for details.
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={accept} size="sm" className="font-bold">
            Got it
          </Button>
          <button
            onClick={accept}
            aria-label="Dismiss cookie notice"
            className="text-text-muted hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
