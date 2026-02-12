"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Lock, Send, Loader2, CalendarDays } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import SectionWrapper from "./SectionWrapper";
import { toast } from "sonner";
import { format } from "date-fns";
import Link from "next/link";

interface Course {
  _id: string;
  date: string;
  location: string;
  spotsTotal: number;
  spotsRemaining: number;
  price: number;
  type: "fixed" | "flexible";
}

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  council: string;
  courseId: string;
  notes: string;
}

const councils = [
  "Southend-on-Sea City Council",
  "Chelmsford City Council",
  "Basildon Borough Council",
  "Thurrock Council",
  "Castle Point Borough Council",
  "Rochford District Council",
  "Maldon District Council",
  "Braintree District Council",
  "Colchester City Council",
  "Tendring District Council",
  "Other (please note in comments)",
];

export default function CourseDates() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>();

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch {
        console.error("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const onSubmit = async (data: BookingFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Something went wrong");
        return;
      }

      if (result.url) {
        window.location.href = result.url;
      } else {
        toast.success("Booking submitted! We'll confirm within 24 hours.");
        reset();
        setSheetOpen(false);
        setSelectedCourse(null);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const openBookingSheet = (course: Course) => {
    setSelectedCourse(course);
    reset();
    setValue("courseId", course._id);
    setSheetOpen(true);
  };

  return (
    <SectionWrapper id="booking" className="px-[5%] py-20">
      <div className="text-xs font-bold tracking-[2px] uppercase text-accent-blue mb-2">
        Upcoming Courses
      </div>
      <h2 className="text-[clamp(1.6rem,3vw,2.3rem)] font-extrabold leading-tight tracking-tight text-white mb-3">
        Pick a date & book
      </h2>
      <p className="text-text-muted text-[0.975rem] leading-relaxed max-w-[520px] mb-10">
        All courses at Cottis House, Rochford, Essex. Need a different date?{" "}
        <Link href="#contact" className="text-accent-blue hover:underline">
          Get in touch.
        </Link>
      </p>

      {/* Course Date Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-navy-light border border-white/8 rounded-xl p-5 animate-pulse h-24"
              />
            ))
          : courses.map((course) => (
              <div
                key={course._id}
                className={`bg-navy-light border rounded-xl p-5 flex justify-between items-center gap-4 transition-all hover:border-accent-blue hover:shadow-lg hover:shadow-accent-blue/10 ${
                  course.type === "flexible"
                    ? "border-dashed border-white/15"
                    : "border-white/8"
                }`}
              >
                <div>
                  <div className="text-[0.65rem] font-bold tracking-widest uppercase text-accent-blue">
                    {course.type === "flexible"
                      ? "Flexible Date"
                      : format(new Date(course.date), "MMMM yyyy")}
                  </div>
                  <div className="text-2xl font-extrabold text-white leading-none tracking-tight my-0.5">
                    {course.type === "flexible"
                      ? "Your Date"
                      : format(new Date(course.date), "d")}
                  </div>
                  <div className="text-xs text-text-muted">
                    {course.type !== "flexible" && (
                      <span className="text-white/60">
                        {format(new Date(course.date), "HH:mm")} &middot;{" "}
                      </span>
                    )}
                    {course.location}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant="outline"
                    className={
                      course.spotsRemaining <= 3
                        ? "bg-amber/10 text-amber border-amber/30 text-xs"
                        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-xs"
                    }
                  >
                    {course.type === "flexible"
                      ? "Available"
                      : `${course.spotsRemaining} spots left`}
                  </Badge>
                  <button
                    onClick={() => openBookingSheet(course)}
                    className="text-xs font-bold px-3 py-1.5 rounded-md bg-navy text-white hover:bg-navy-lighter transition-colors whitespace-nowrap"
                  >
                    {course.type === "flexible" ? "Request →" : "Book →"}
                  </button>
                </div>
              </div>
            ))}
      </div>

      {/* Booking Sheet */}
      <Sheet open={sheetOpen} onOpenChange={(open) => {
        setSheetOpen(open);
        if (!open) setSelectedCourse(null);
      }}>
        <SheetContent
          side="right"
          className="bg-navy-light border-white/8 w-full sm:max-w-lg overflow-y-auto"
        >
          <SheetHeader className="pb-2">
            <SheetTitle className="text-white text-xl font-extrabold">
              Reserve Your Place
            </SheetTitle>
            <SheetDescription className="text-text-muted text-sm">
              Fill in your details and we&apos;ll confirm within 24 hours.
            </SheetDescription>
          </SheetHeader>

          {selectedCourse && (
            <div className="mx-4 mb-2 flex items-center gap-3 rounded-lg bg-navy border border-white/8 p-3">
              <CalendarDays className="w-5 h-5 text-accent-blue shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">
                  {selectedCourse.type === "flexible"
                    ? "Flexible Date"
                    : format(new Date(selectedCourse.date), "d MMMM yyyy, HH:mm")}
                </p>
                <p className="text-xs text-text-muted">
                  {selectedCourse.location} — £{selectedCourse.price}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sheet-firstName">First Name</Label>
                <Input
                  id="sheet-firstName"
                  placeholder="John"
                  {...register("firstName", { required: "First name is required" })}
                  className="mt-1"
                />
                {errors.firstName && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="sheet-lastName">Last Name</Label>
                <Input
                  id="sheet-lastName"
                  placeholder="Smith"
                  {...register("lastName", { required: "Last name is required" })}
                  className="mt-1"
                />
                {errors.lastName && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="sheet-email">Email Address</Label>
              <Input
                id="sheet-email"
                type="email"
                placeholder="john@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                className="mt-1"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="sheet-phone">Phone Number</Label>
              <Input
                id="sheet-phone"
                type="tel"
                placeholder="07700 000000"
                {...register("phone", { required: "Phone number is required" })}
                className="mt-1"
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <Label>Your Licensing Council</Label>
              <Select onValueChange={(val) => setValue("council", val)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your council…" />
                </SelectTrigger>
                <SelectContent>
                  {councils.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sheet-notes">Notes (optional)</Label>
              <Textarea
                id="sheet-notes"
                placeholder="Any questions or requirements…"
                {...register("notes")}
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-4 pt-2 flex-wrap">
              <Button
                type="submit"
                disabled={submitting}
                className="font-bold"
                size="lg"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-1" />
                )}
                Reserve My Place
              </Button>
              <span className="text-xs text-text-muted flex items-center gap-1">
                <Lock className="w-3 h-3" />
                No payment taken until confirmed
              </span>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </SectionWrapper>
  );
}
