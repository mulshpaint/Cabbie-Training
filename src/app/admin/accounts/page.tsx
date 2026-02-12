"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2, Check, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface AdminAccount {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function AdminAccounts() {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin/accounts");
      const data = await res.json();
      setAdmins(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const addAdmin = async () => {
    if (!newName.trim() || !newEmail.trim() || !newPassword) {
      toast.error("All fields are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          email: newEmail.trim(),
          password: newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Admin account created");
        setNewName("");
        setNewEmail("");
        setNewPassword("");
        setAdding(false);
        fetchAdmins();
      } else {
        toast.error(data.error || "Failed to create account");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const deleteAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to remove this admin account?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/accounts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success("Admin account removed");
        fetchAdmins();
      } else {
        toast.error(data.error || "Failed to remove account");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Admin Accounts</h1>
            <p className="text-sm text-text-muted mt-1">
              Manage who can access the admin panel.
            </p>
          </div>
          <Button onClick={() => setAdding(true)} disabled={adding} className="font-medium">
            <Plus className="w-4 h-4 mr-1" />
            Add Admin
          </Button>
        </div>

        {/* Add form */}
        {adding && (
          <div className="bg-navy-light border border-white/8 rounded-xl p-5 mb-6 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-4">New Admin Account</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <Label className="text-xs">Name</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Wendy Clarke"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Email</Label>
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. wendy@cabbietraining.co.uk"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addAdmin} disabled={saving} size="sm" className="font-medium">
                {saving ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Check className="w-3.5 h-3.5 mr-1" />}
                Create Account
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAdding(false);
                  setNewName("");
                  setNewEmail("");
                  setNewPassword("");
                }}
                className="font-medium"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Accounts list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-navy-light border border-white/8 rounded-xl p-5 h-32 animate-pulse"
                />
              ))
            : admins.map((admin) => (
                <div
                  key={admin._id}
                  className="bg-navy-light border border-white/8 rounded-xl p-5 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent-blue/10 rounded-full flex items-center justify-center text-accent-blue font-bold text-sm">
                        {admin.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{admin.name}</div>
                        <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                          <Mail className="w-3 h-3" />
                          {admin.email}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteAdmin(admin._id)}
                      disabled={deletingId === admin._id}
                      title="Remove admin"
                      className="p-1.5 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
                    >
                      {deletingId === admin._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-text-muted mt-3 pt-3 border-t border-white/8">
                    <User className="w-3 h-3" />
                    Added {format(new Date(admin.createdAt), "d MMM yyyy")}
                  </div>
                </div>
              ))}
        </div>

        {!loading && admins.length === 0 && (
          <div className="bg-navy-light border border-white/8 rounded-xl p-8 text-center">
            <p className="text-text-muted text-sm">No admin accounts found</p>
          </div>
        )}
      </main>
    </div>
  );
}
