"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Download,
  Loader2,
  Eye,
  Trash2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Booking {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  council: string;
  notes?: string;
  stripeSessionId?: string;
  status: string;
  createdAt: string;
  course?: {
    date: string;
    type: string;
    location: string;
    price: number;
  };
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionId, setActionId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const fetchBookings = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/bookings?${params}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Booking marked as ${status}`);
        fetchBookings();
        if (selectedBooking?._id === id) {
          setSelectedBooking({ ...selectedBooking, status });
        }
      } else {
        toast.error("Failed to update booking");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setActionId(null);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this booking?")) return;
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Booking deleted");
        setSheetOpen(false);
        setSelectedBooking(null);
        fetchBookings();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete booking");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setActionId(null);
    }
  };

  const refundBooking = async (id: string) => {
    if (!confirm("Issue a full refund for this booking? This cannot be undone.")) return;
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "refund" }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Refund issued successfully");
        fetchBookings();
        if (selectedBooking?._id === id) {
          setSelectedBooking({ ...selectedBooking, status: "refunded" });
        }
      } else {
        toast.error(data.error || "Failed to issue refund");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setActionId(null);
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Council", "Course Date", "Status", "Booked On"];
    const rows = bookings.map((b) => [
      `${b.firstName} ${b.lastName}`,
      b.email,
      b.phone,
      b.council,
      b.course
        ? b.course.type === "flexible"
          ? "Flexible"
          : format(new Date(b.course.date), "d MMM yyyy HH:mm")
        : "—",
      b.status,
      format(new Date(b.createdAt), "d MMM yyyy"),
    ]);

    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: "bg-emerald-500/10 text-emerald-400",
      confirmed: "bg-accent-blue/10 text-accent-blue",
      cancelled: "bg-red-500/10 text-red-400",
      refunded: "bg-purple-500/10 text-purple-400",
      pending: "bg-amber/10 text-amber",
    };
    return (
      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status] || styles.pending}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-extrabold text-white">Bookings</h1>
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportCSV} className="font-medium">
              <Download className="w-4 h-4 mr-1" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="bg-navy-light border border-white/8 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">Name</th>
                  <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">Course</th>
                  <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">Booked</th>
                  <th className="text-right text-xs font-semibold text-text-muted px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j} className="px-6 py-3">
                            <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : bookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="border-b border-white/5 hover:bg-white/3 cursor-pointer"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setSheetOpen(true);
                        }}
                      >
                        <td className="px-6 py-3">
                          <div className="text-sm text-white font-medium">
                            {booking.firstName} {booking.lastName}
                          </div>
                          <div className="text-xs text-text-muted">{booking.email}</div>
                        </td>
                        <td className="px-6 py-3 text-sm text-text-muted">
                          {booking.course
                            ? booking.course.type === "flexible"
                              ? "Flexible"
                              : format(new Date(booking.course.date), "d MMM yyyy, HH:mm")
                            : "—"}
                        </td>
                        <td className="px-6 py-3">
                          {statusBadge(booking.status)}
                        </td>
                        <td className="px-6 py-3 text-sm text-text-muted">
                          {format(new Date(booking.createdAt), "d MMM yyyy")}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            {actionId === booking._id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-text-muted" />
                            ) : (
                              <>
                                {booking.status === "pending" && (
                                  <button
                                    onClick={() => updateStatus(booking._id, "confirmed")}
                                    title="Confirm"
                                    className="p-1.5 rounded-md hover:bg-accent-blue/10 text-text-muted hover:text-accent-blue transition-colors"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {booking.status !== "cancelled" && booking.status !== "refunded" && (
                                  <button
                                    onClick={() => updateStatus(booking._id, "cancelled")}
                                    title="Cancel"
                                    className="p-1.5 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {booking.status === "paid" && (
                                  <button
                                    onClick={() => refundBooking(booking._id)}
                                    title="Refund"
                                    className="p-1.5 rounded-md hover:bg-purple-500/10 text-text-muted hover:text-purple-400 transition-colors"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteBooking(booking._id)}
                                  title="Delete"
                                  className="p-1.5 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                {!loading && bookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-text-muted text-sm">
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Booking Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={(open) => {
        setSheetOpen(open);
        if (!open) setSelectedBooking(null);
      }}>
        <SheetContent
          side="right"
          className="bg-navy-light border-white/8 w-full sm:max-w-lg overflow-y-auto"
        >
          <SheetHeader className="pb-2">
            <SheetTitle className="text-white text-xl font-extrabold">
              Booking Details
            </SheetTitle>
            <SheetDescription className="text-text-muted text-sm">
              {selectedBooking
                ? `${selectedBooking.firstName} ${selectedBooking.lastName}`
                : ""}
            </SheetDescription>
          </SheetHeader>

          {selectedBooking && (
            <div className="px-4 pb-4 space-y-4">
              {/* Status */}
              <div className="flex items-center gap-3">
                {statusBadge(selectedBooking.status)}
                {selectedBooking.stripeSessionId && (
                  <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                    <CreditCard className="w-3 h-3" />
                    Stripe payment
                  </span>
                )}
              </div>

              {/* Course info */}
              {selectedBooking.course && (
                <div className="flex items-center gap-3 rounded-lg bg-navy border border-white/8 p-3">
                  <CalendarDays className="w-5 h-5 text-accent-blue shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-white">
                      {selectedBooking.course.type === "flexible"
                        ? "Flexible Date"
                        : format(new Date(selectedBooking.course.date), "d MMMM yyyy, HH:mm")}
                    </p>
                    <p className="text-xs text-text-muted">
                      {selectedBooking.course.location} — £{selectedBooking.course.price}
                    </p>
                  </div>
                </div>
              )}

              {/* Contact details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold tracking-widest uppercase text-text-muted">
                  Contact Details
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-sm">
                    <Mail className="w-4 h-4 text-text-muted shrink-0" />
                    <a href={`mailto:${selectedBooking.email}`} className="text-accent-blue hover:underline">
                      {selectedBooking.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <Phone className="w-4 h-4 text-text-muted shrink-0" />
                    <a href={`tel:${selectedBooking.phone}`} className="text-white hover:text-accent-blue">
                      {selectedBooking.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <MapPin className="w-4 h-4 text-text-muted shrink-0" />
                    <span className="text-white">{selectedBooking.council}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold tracking-widest uppercase text-text-muted">
                    Notes
                  </h4>
                  <div className="flex items-start gap-2.5 text-sm">
                    <FileText className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                    <p className="text-white">{selectedBooking.notes}</p>
                  </div>
                </div>
              )}

              {/* Booked date */}
              <div className="text-xs text-text-muted pt-1">
                Booked on {format(new Date(selectedBooking.createdAt), "d MMMM yyyy 'at' HH:mm")}
              </div>

              {/* Actions */}
              <div className="border-t border-white/8 pt-4 space-y-2">
                <h4 className="text-xs font-bold tracking-widest uppercase text-text-muted mb-3">
                  Actions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBooking.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(selectedBooking._id, "confirmed")}
                      disabled={actionId === selectedBooking._id}
                      className="font-medium"
                    >
                      {actionId === selectedBooking._id ? (
                        <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      )}
                      Confirm Booking
                    </Button>
                  )}
                  {selectedBooking.status !== "cancelled" && selectedBooking.status !== "refunded" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(selectedBooking._id, "cancelled")}
                      disabled={actionId === selectedBooking._id}
                      className="font-medium text-red-400 border-red-500/30 hover:bg-red-500/10"
                    >
                      {actionId === selectedBooking._id ? (
                        <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                      )}
                      Cancel Booking
                    </Button>
                  )}
                  {selectedBooking.status === "paid" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => refundBooking(selectedBooking._id)}
                      disabled={actionId === selectedBooking._id}
                      className="font-medium text-purple-400 border-purple-500/30 hover:bg-purple-500/10"
                    >
                      {actionId === selectedBooking._id ? (
                        <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                      ) : (
                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      )}
                      Issue Refund
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteBooking(selectedBooking._id)}
                    disabled={actionId === selectedBooking._id}
                    className="font-medium text-red-400 border-red-500/30 hover:bg-red-500/10"
                  >
                    {actionId === selectedBooking._id ? (
                      <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                    )}
                    Delete Booking
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
