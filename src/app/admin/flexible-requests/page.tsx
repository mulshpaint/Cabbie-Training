"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Loader2,
  Eye,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface FlexibleRequest {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  council: string;
  preferredDates: string;
  notes?: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminFlexibleRequests() {
  const [requests, setRequests] = useState<FlexibleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionId, setActionId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<FlexibleRequest | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [bookingLinkModalOpen, setBookingLinkModalOpen] = useState(false);

  // Booking link form state
  const [courseDate, setCourseDate] = useState("");
  const [courseTime, setTime] = useState("");
  const [courseLocation, setLocation] = useState("Cottis House, Rochford, Essex");
  const [coursePrice, setPrice] = useState(95);
  const [sendingLink, setSendingLink] = useState(false);

  const fetchRequests = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/flexible-requests?${params}`);
      const data = await res.json();
      setRequests(data.requests || []);
    } catch {
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/flexible-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Request marked as ${status}`);
        fetchRequests();
        if (selectedRequest?._id === id) {
          setSelectedRequest({ ...selectedRequest, status });
        }
      } else {
        toast.error("Failed to update request");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setActionId(null);
    }
  };

  const updateAdminNotes = async (id: string, adminNotes: string) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/flexible-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
      if (res.ok) {
        toast.success("Notes updated");
        fetchRequests();
        if (selectedRequest?._id === id) {
          setSelectedRequest({ ...selectedRequest, adminNotes });
        }
      } else {
        toast.error("Failed to update notes");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setActionId(null);
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this request?")) return;
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/flexible-requests/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Request deleted");
        setSheetOpen(false);
        setSelectedRequest(null);
        fetchRequests();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete request");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setActionId(null);
    }
  };

  const sendBookingLink = async () => {
    if (!selectedRequest) return;
    if (!courseDate || !courseTime || !courseLocation || !coursePrice) {
      toast.error("Please fill in all course details");
      return;
    }

    setSendingLink(true);
    try {
      const combinedDateTime = `${courseDate}T${courseTime}:00`;
      
      const res = await fetch(`/api/admin/flexible-requests/${selectedRequest._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sendBookingLink",
          courseData: {
            date: combinedDateTime,
            location: courseLocation,
            price: coursePrice,
          },
        }),
      });

      if (res.ok) {
        toast.success("Booking link sent successfully!");
        setBookingLinkModalOpen(false);
        setCourseDate("");
        setTime("");
        setLocation("Cottis House, Rochford, Essex");
        setPrice(95);
        fetchRequests();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to send booking link");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSendingLink(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 rounded-full bg-amber/10 text-amber text-xs font-bold">Pending</span>;
      case "contacted":
        return <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold">Contacted</span>;
      case "booked":
        return <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold">Booked</span>;
      case "cancelled":
        return <span className="px-2 py-1 rounded-full bg-red-400/10 text-red-400 text-xs font-bold">Cancelled</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-white/10 text-white/60 text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="flex min-h-screen bg-navy">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Flexible Booking Requests</h1>
              <p className="text-text-muted text-sm mt-1">
                Manage custom date requests from customers
              </p>
            </div>
          </div>

          {/* Filter */}
          <div className="mb-6 flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 bg-navy-light rounded-xl border border-white/8">
              <p className="text-text-muted">No requests found</p>
            </div>
          ) : (
            <div className="bg-navy-light rounded-xl border border-white/8 overflow-hidden">
              <table className="w-full">
                <thead className="bg-navy border-b border-white/8">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-bold text-text-muted uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-text-muted uppercase">Contact</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-text-muted uppercase">Preferred Dates</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-text-muted uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-text-muted uppercase">Created</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-text-muted uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {requests.map((req) => (
                    <tr key={req._id} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 text-sm text-white font-medium">
                        {req.firstName} {req.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs">
                            <Mail className="w-3 h-3" />
                            {req.email}
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Phone className="w-3 h-3" />
                            {req.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted max-w-xs truncate">
                        {req.preferredDates}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(req.status)}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted">
                        {format(new Date(req.createdAt), "d MMM yyyy")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedRequest(req);
                            setSheetOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={(open) => {
        setSheetOpen(open);
        if (!open) setSelectedRequest(null);
      }}>
        <SheetContent side="right" className="bg-navy-light border-white/8 w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-white text-xl font-extrabold">
              Request Details
            </SheetTitle>
            <SheetDescription className="text-text-muted text-sm">
              View and manage this flexible booking request
            </SheetDescription>
          </SheetHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-navy rounded-xl border border-white/8 p-4">
                <h3 className="text-sm font-bold text-white mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-text-muted min-w-[100px]">Name:</span>
                    <span className="text-white font-medium">{selectedRequest.firstName} {selectedRequest.lastName}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-accent-blue mt-0.5 min-w-[16px]" />
                    <a href={`mailto:${selectedRequest.email}`} className="text-accent-blue hover:underline">
                      {selectedRequest.email}
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-accent-blue mt-0.5 min-w-[16px]" />
                    <a href={`tel:${selectedRequest.phone}`} className="text-accent-blue hover:underline">
                      {selectedRequest.phone}
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-accent-blue mt-0.5 min-w-[16px]" />
                    <span className="text-white">{selectedRequest.council}</span>
                  </div>
                </div>
              </div>

              {/* Preferred Dates */}
              <div className="bg-navy rounded-xl border border-white/8 p-4">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent-blue" />
                  Preferred Dates
                </h3>
                <p className="text-sm text-white whitespace-pre-wrap">{selectedRequest.preferredDates}</p>
              </div>

              {/* Customer Notes */}
              {selectedRequest.notes && (
                <div className="bg-navy rounded-xl border border-white/8 p-4">
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent-blue" />
                    Customer Notes
                  </h3>
                  <p className="text-sm text-text-muted whitespace-pre-wrap">{selectedRequest.notes}</p>
                </div>
              )}

              {/* Admin Notes */}
              <div className="bg-navy rounded-xl border border-white/8 p-4">
                <h3 className="text-sm font-bold text-white mb-2">Admin Notes (Internal)</h3>
                <Textarea
                  defaultValue={selectedRequest.adminNotes || ""}
                  placeholder="Add internal notes about this request..."
                  className="mb-2"
                  rows={3}
                  id="admin-notes"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const textarea = document.getElementById("admin-notes") as HTMLTextAreaElement;
                    updateAdminNotes(selectedRequest._id, textarea.value);
                  }}
                  disabled={actionId === selectedRequest._id}
                >
                  {actionId === selectedRequest._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save Notes"
                  )}
                </Button>
              </div>

              {/* Status & Actions */}
              <div className="bg-navy rounded-xl border border-white/8 p-4">
                <h3 className="text-sm font-bold text-white mb-3">Status & Actions</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    size="sm"
                    variant={selectedRequest.status === "pending" ? "default" : "outline"}
                    onClick={() => updateStatus(selectedRequest._id, "pending")}
                    disabled={actionId === selectedRequest._id}
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Pending
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedRequest.status === "contacted" ? "default" : "outline"}
                    onClick={() => updateStatus(selectedRequest._id, "contacted")}
                    disabled={actionId === selectedRequest._id}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Contacted
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedRequest.status === "cancelled" ? "destructive" : "outline"}
                    onClick={() => updateStatus(selectedRequest._id, "cancelled")}
                    disabled={actionId === selectedRequest._id}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Cancelled
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => setBookingLinkModalOpen(true)}
                    disabled={selectedRequest.status === "booked" || selectedRequest.status === "cancelled"}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Booking Link
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteRequest(selectedRequest._id)}
                    disabled={actionId === selectedRequest._id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="text-xs text-text-muted">
                <p>Created: {format(new Date(selectedRequest.createdAt), "d MMMM yyyy 'at' HH:mm")}</p>
                <p>Last updated: {format(new Date(selectedRequest.updatedAt), "d MMMM yyyy 'at' HH:mm")}</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Booking Link Modal */}
      {bookingLinkModalOpen && selectedRequest && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setBookingLinkModalOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-navy-light border border-white/10 rounded-2xl w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-white/10 px-6 py-4">
                <h2 className="text-xl font-extrabold text-white">Create Booking Link</h2>
                <p className="text-sm text-text-muted mt-1">
                  Set course details for {selectedRequest.firstName} {selectedRequest.lastName}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <Label htmlFor="course-date">Date</Label>
                  <Input
                    id="course-date"
                    type="date"
                    value={courseDate}
                    onChange={(e) => setCourseDate(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="course-time">Time</Label>
                  <Input
                    id="course-time"
                    type="time"
                    value={courseTime}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="course-location">Location</Label>
                  <Input
                    id="course-location"
                    value={courseLocation}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Cottis House, Rochford, Essex"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="course-price">Price (£)</Label>
                  <Input
                    id="course-price"
                    type="number"
                    value={coursePrice}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={sendBookingLink}
                    disabled={sendingLink}
                    className="flex-1 font-bold"
                  >
                    {sendingLink ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Link
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setBookingLinkModalOpen(false)}
                    disabled={sendingLink}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
