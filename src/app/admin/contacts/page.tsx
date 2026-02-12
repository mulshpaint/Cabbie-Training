"use client";

import { useEffect, useState, useRef } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MailOpen, Loader2, Send } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface ContactMsg {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  replied: boolean;
  createdAt: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  const selected = contacts.find((c) => c._id === selectedId) || null;

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/admin/contacts");
      const data = await res.json();
      setContacts(data);
    } catch {
      toast.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const updateContact = async (id: string, updates: Partial<ContactMsg>) => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        await fetchContacts();
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleSelect = (contact: ContactMsg) => {
    setSelectedId(contact._id);
    setReplyText("");
    if (!contact.read) {
      updateContact(contact._id, { read: true });
    }
  };

  const toggleReplied = () => {
    if (!selected) return;
    const newVal = !selected.replied;
    updateContact(selected._id, { replied: newVal });
    toast.success(newVal ? "Marked as replied" : "Marked as needs reply");
  };

  const sendReply = async () => {
    if (!selected || !replyText.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/admin/contacts/${selected._id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyText.trim() }),
      });
      if (res.ok) {
        toast.success(`Reply sent to ${selected.email}`);
        setReplyText("");
        await fetchContacts();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to send reply");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-extrabold text-white mb-6">
          Contact Messages
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
          {/* Message list */}
          <div className="bg-navy-light border border-white/8 rounded-xl shadow-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-white/8">
              <span className="text-sm text-text-muted">
                {contacts.filter((c) => !c.read).length} unread
              </span>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-6 flex justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
                </div>
              ) : contacts.length === 0 ? (
                <p className="p-6 text-center text-text-muted text-sm">
                  No messages yet
                </p>
              ) : (
                contacts.map((contact) => (
                  <button
                    key={contact._id}
                    onClick={() => handleSelect(contact)}
                    className={`w-full text-left px-5 py-4 border-b border-white/5 transition-colors cursor-pointer ${
                      selectedId === contact._id
                        ? "bg-accent-blue/5"
                        : "hover:bg-white/3"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {contact.read ? (
                          <MailOpen className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                        ) : (
                          <Mail className="w-3.5 h-3.5 text-accent-blue flex-shrink-0" />
                        )}
                        <span
                          className={`text-sm truncate ${
                            contact.read
                              ? "text-text-muted"
                              : "text-white font-semibold"
                          }`}
                        >
                          {contact.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {contact.replied && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                            Replied
                          </span>
                        )}
                        <span className="text-xs text-text-muted whitespace-nowrap">
                          {format(new Date(contact.createdAt), "d MMM")}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-text-muted mt-1 truncate pl-5.5">
                      {contact.subject}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Message detail */}
          <div className="bg-navy-light border border-white/8 rounded-xl shadow-lg p-6">
            {selected ? (
              <>
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {selected.subject}
                    </h2>
                    <p className="text-sm text-text-muted mt-0.5">
                      From {selected.name} · {selected.email}
                      {selected.phone && ` · ${selected.phone}`}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {format(
                        new Date(selected.createdAt),
                        "d MMMM yyyy 'at' HH:mm"
                      )}
                    </p>
                  </div>
                  <button
                    onClick={toggleReplied}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                      selected.replied
                        ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                    }`}
                  >
                    {selected.replied ? "Replied ✓" : "Needs reply"}
                  </button>
                </div>

                <div className="bg-navy rounded-lg p-5">
                  <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>

                {/* Inline reply */}
                <div className="mt-4 border-t border-white/8 pt-4">
                  <Textarea
                    ref={replyRef}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${selected.name}…`}
                    rows={3}
                    className="resize-none"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                      className="text-xs text-text-muted hover:text-accent-blue transition-colors"
                    >
                      or open in email client
                    </a>
                    <Button
                      onClick={sendReply}
                      disabled={sending || !replyText.trim()}
                      size="sm"
                      className="font-medium"
                    >
                      {sending ? (
                        <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5 mr-1" />
                      )}
                      Send Reply
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[300px] text-text-muted text-sm">
                Select a message to view
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
