"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Lock, Send, Loader2, CalendarDays, ChevronRight } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import SectionWrapper from "./SectionWrapper";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import Link from "next/link";
import FlexibleRequestModal from "./FlexibleRequestModal";

interface Course {
  _id: string;
  date: string;
  location: string;
  spotsTotal: number;
  spotsRemaining: number;
  price: number;
  type: "fixed" | "flexible";
}

interface DateGroup {
  dateKey: string;
  dateLabel: string;
  dayLabel: string;
  courses: Course[];
}

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  council: string;
  courseId: string;
  notes: string;
  privacyConsent: boolean;
}

interface CouncilOption {
  _id: string;
  displayName: string;
}

function groupCoursesByDate(courses: Course[]): { fixed: DateGroup[]; flexible: Course[] } {
  const fixed = courses
    .filter((c) => c.type === "fixed")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const groups: DateGroup[] = [];
  for (const course of fixed) {
    const d = new Date(course.date);
    const dateKey = format(d, "yyyy-MM-dd");
    const existing = groups.find((g) => g.dateKey === dateKey);
    if (existing) {
      existing.courses.push(course);
    } else {
      groups.push({
        dateKey,
        dateLabel: format(d, "d MMMM yyyy"),
        dayLabel: format(d, "EEEE"),
        courses: [course],
      });
    }
  }
  return { fixed: groups, flexible: courses.filter((c) => c.type === "flexible") };
}

export default function CourseDates() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [councils, setCouncils] = useState<CouncilOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [flexModalOpen, setFlexModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>();

  register("privacyConsent", { validate: (v) => v === true || "You must agree to the Privacy Policy" });

  useEffect(() => {
    async function fetchData() {
      try {
        const [coursesRes, councilsRes] = await Promise.all([
          fetch("/api/courses"),
          fetch("/api/councils"),
        ]);
        const coursesData = await coursesRes.json();
        const councilsData = await councilsRes.json();
        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setCouncils(Array.isArray(councilsData) ? councilsData : []);
      } catch {
        console.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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
    <SectionWrapper id="booking" className="py-20 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-[5%]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
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
      </motion.div>

      {/* Course Date Groups */}
      {loading ? (
        <div className="border border-white/8 rounded-2xl overflow-hidden divide-y divide-white/8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6 p-6">
              <div className="w-36 shrink-0 space-y-2">
                <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
                <div className="h-10 w-10 bg-white/5 rounded animate-pulse" />
                <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
              </div>
              <div className="hidden sm:block w-px h-16 bg-white/8" />
              <div className="flex gap-3 flex-1">
                <div className="flex-1 max-w-[200px] h-24 bg-white/5 rounded-xl animate-pulse" />
                <div className="flex-1 max-w-[200px] h-24 bg-white/5 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (() => {
        const { fixed: allGroups, flexible: flexibleCourses } = groupCoursesByDate(courses);
        const cutoff = addDays(new Date(), 30);
        const visibleGroups = showAll ? allGroups : allGroups.filter((g) => new Date(g.dateKey) <= cutoff);
        const hiddenCount = allGroups.length - visibleGroups.length;

        if (allGroups.length === 0 && flexibleCourses.length === 0) {
          return (
            <div className="text-center py-16 border border-white/8 rounded-2xl">
              <CalendarDays className="w-10 h-10 text-white/15 mx-auto mb-4" />
              <p className="text-white font-bold mb-1">No upcoming courses</p>
              <p className="text-text-muted text-sm">
                <Link href="#contact" className="text-accent-blue hover:underline">Get in touch</Link> to find out about upcoming dates.
              </p>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {/* Fixed-date courses */}
            {visibleGroups.length > 0 && (
              <div className="border border-white/8 rounded-2xl overflow-hidden divide-y divide-white/8">
                {visibleGroups.map((group) => (
                  <div
                    key={group.dateKey}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 px-6 py-5 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Date column */}
                    <div className="shrink-0 sm:w-36">
                      <div className="text-accent-blue text-[0.65rem] font-bold uppercase tracking-[0.15em] mb-0.5">
                        {group.dayLabel}
                      </div>
                      <div className="text-white text-4xl font-extrabold leading-none">
                        {format(new Date(group.dateKey), "d")}
                      </div>
                      <div className="text-text-muted text-sm mt-1">
                        {format(new Date(group.dateKey), "MMMM yyyy")}
                      </div>
                    </div>

                    {/* Vertical divider (desktop) */}
                    <div className="hidden sm:block w-px self-stretch bg-white/8" />
                    {/* Horizontal divider (mobile) */}
                    <div className="sm:hidden w-full h-px bg-white/8" />

                    {/* Session chips */}
                    <div className="flex flex-wrap gap-3 flex-1">
                      {group.courses
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((course) => (
                          <button
                            key={course._id}
                            onClick={() => openBookingSheet(course)}
                            className="group flex-1 min-w-[150px] max-w-[220px] bg-navy border border-white/10 rounded-xl p-4 text-left hover:border-accent-blue/60 hover:bg-navy-light hover:shadow-xl hover:shadow-accent-blue/10 transition-all cursor-pointer"
                          >
                            <div className="text-white font-extrabold text-2xl leading-none mb-1.5">
                              {format(new Date(course.date), "HH:mm")}
                            </div>
                            <div className={`text-xs mb-3 ${
                              course.spotsRemaining <= 3 ? "text-amber" : "text-text-muted"
                            }`}>
                              {course.spotsRemaining === 0
                                ? "Fully booked"
                                : `${course.spotsRemaining} of ${course.spotsTotal} spots left`}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white font-bold text-sm">£{course.price}</span>
                              <span className="text-accent-blue text-xs font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                                Book <ChevronRight className="w-3 h-3" />
                              </span>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View more / collapse */}
            {!showAll && hiddenCount > 0 && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full py-3.5 text-sm text-text-muted hover:text-white border border-white/8 hover:border-white/20 rounded-2xl transition-all font-medium"
              >
                View {hiddenCount} more date{hiddenCount !== 1 ? "s" : ""} &darr;
              </button>
            )}
            {showAll && allGroups.length > 3 && (
              <button
                onClick={() => setShowAll(false)}
                className="w-full py-3.5 text-sm text-text-muted hover:text-white border border-white/8 hover:border-white/20 rounded-2xl transition-all font-medium"
              >
                Show fewer dates &uarr;
              </button>
            )}

            {/* Flexible / any date */}
            {flexibleCourses.length > 0 && (
              <div className="border border-dashed border-white/15 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 hover:bg-white/[0.02] transition-colors">
                <div className="shrink-0 sm:w-36">
                  <div className="text-accent-blue text-[0.65rem] font-bold uppercase tracking-[0.15em] mb-0.5">Flexible</div>
                  <div className="text-white text-4xl font-extrabold leading-none">Any</div>
                  <div className="text-text-muted text-sm mt-1">Date</div>
                </div>
                <div className="hidden sm:block w-px self-stretch bg-white/8" />
                <div className="sm:hidden w-full h-px bg-white/8" />
                <div className="flex flex-wrap gap-3 flex-1">
                  {flexibleCourses.map((course) => (
                    <button
                      key={course._id}
                      onClick={() => setFlexModalOpen(true)}
                      className="group flex-1 min-w-[150px] max-w-[220px] bg-navy border border-white/10 rounded-xl p-4 text-left hover:border-accent-blue/60 hover:bg-navy-light hover:shadow-xl hover:shadow-accent-blue/10 transition-all cursor-pointer"
                    >
                      <div className="text-white font-extrabold text-2xl leading-none mb-1.5">Flexible</div>
                      <div className="text-text-muted text-xs mb-3">Pick a date that suits you</div>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-sm">£{course.price}</span>
                        <span className="text-accent-blue text-xs font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                          Request <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

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
                    <SelectItem key={c._id} value={c.displayName}>
                      {c.displayName}
                    </SelectItem>
                  ))}
                  <SelectItem value="Other (please note in comments)">
                    Other (please note in comments)
                  </SelectItem>
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

            <div className="flex items-start gap-2 pt-1">
              <Checkbox
                id="sheet-privacy"
                onCheckedChange={(checked) =>
                  setValue("privacyConsent", checked === true, { shouldValidate: true })
                }
                className="mt-0.5"
              />
              <label htmlFor="sheet-privacy" className="text-xs text-text-muted leading-relaxed cursor-pointer">
                I agree to the{" "}
                <Link href="/privacy-policy" target="_blank" className="text-accent-blue hover:underline">
                  Privacy Policy
                </Link>
                . My data will be used to process this booking and contact me about the course.
              </label>
            </div>
            {errors.privacyConsent && (
              <p className="text-red-400 text-xs">
                {errors.privacyConsent.message}
              </p>
            )}

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

      <FlexibleRequestModal 
        open={flexModalOpen}
        onClose={() => setFlexModalOpen(false)}
      />
      </div>
    </SectionWrapper>
  );
}
