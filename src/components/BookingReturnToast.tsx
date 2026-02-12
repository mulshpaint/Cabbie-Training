"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function BookingReturnToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const hasHandledRef = useRef(false);

  useEffect(() => {
    if (hasHandledRef.current) return;

    const booking = searchParams.get("booking");
    if (!booking) return;

    hasHandledRef.current = true;

    if (booking === "success") {
      toast.success("Payment successful — your booking is confirmed.");
    } else if (booking === "cancelled") {
      toast.error("Payment cancelled — no charge was made.");
    }

    router.replace(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router, pathname]);

  return null;
}
