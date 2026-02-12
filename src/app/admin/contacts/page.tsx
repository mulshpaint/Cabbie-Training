"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Mail, MailOpen, Loader2 } from "lucide-react";
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
  const [selected, setSelected] = useState<ContactMsg | null>(null);

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

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      fetchContacts();
    } catch {
      toast.error("Failed to update");
    }
  };

  const toggleReplied = async (id: string, replied: boolean) => {
    try {
      await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replied: !replied }),
      });
      toast.success(replied ? "Marked as unreplied" : "Marked as replied");
      fetchContacts();
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleSelect = (contact: ContactMsg) => {
    setSelected(contact);
    if (!contact.read) {
      markAsRead(contact._id);
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
                      selected?._id === contact._id
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
                      <span className="text-xs text-text-muted whitespace-nowrap">
                        {format(new Date(contact.createdAt), "d MMM")}
                      </span>
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
                    onClick={() =>
                      toggleReplied(selected._id, selected.replied)
                    }
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${
                      selected.replied
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber/10 text-amber"
                    }`}
                  >
                    {selected.replied ? "Replied" : "Needs reply"}
                  </button>
                </div>
                <div className="bg-navy rounded-lg p-5">
                  <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-blue hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Reply via email
                  </a>
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
