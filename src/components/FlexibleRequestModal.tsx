"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2, Send } from "lucide-react";
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
import { toast } from "sonner";

interface FlexibleRequestFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  council: string;
  preferredDates: string;
  notes: string;
}

interface CouncilOption {
  _id: string;
  displayName: string;
}

interface FlexibleRequestModalProps {
  open: boolean;
  onClose: () => void;
}

export default function FlexibleRequestModal({ open, onClose }: FlexibleRequestModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [councils, setCouncils] = useState<CouncilOption[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FlexibleRequestFormData>();

  useEffect(() => {
    async function fetchCouncils() {
      try {
        const res = await fetch("/api/councils");
        const data = await res.json();
        setCouncils(Array.isArray(data) ? data : []);
      } catch {
        console.error("Failed to fetch councils");
      }
    }
    fetchCouncils();
  }, []);

  const onSubmit = async (data: FlexibleRequestFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/flexible-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Something went wrong");
        return;
      }

      toast.success("Request submitted! We'll be in touch within 24 hours.");
      reset();
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-navy-light border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-navy-light border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white">Request a Flexible Date</h2>
              <p className="text-sm text-text-muted mt-1">
                Tell us your preferred dates and we'll get back to you
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
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
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
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
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
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
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
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
                  <SelectItem value="Other (please note below)">
                    Other (please note below)
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.council && (
                <p className="text-red-400 text-xs mt-1">
                  Please select your council
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="preferredDates">Preferred Dates</Label>
              <Textarea
                id="preferredDates"
                placeholder="e.g., Weekdays after 2pm, or any weekend in March"
                {...register("preferredDates", { required: "Please specify your preferred dates" })}
                className="mt-1 min-h-[80px]"
              />
              {errors.preferredDates && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.preferredDates.message}
                </p>
              )}
              <p className="text-xs text-text-muted mt-1">
                Let us know what dates/times work best for you
              </p>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any questions or special requirements…"
                {...register("notes")}
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                disabled={submitting}
                className="font-bold flex-1"
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={submitting}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
