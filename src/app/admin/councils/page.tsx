"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  Loader2,
  GripVertical,
  Eye,
  EyeOff,
  Pencil,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface Council {
  _id: string;
  name: string;
  displayName: string;
  note?: string;
  active: boolean;
  order: number;
}

export default function AdminCouncils() {
  const [councils, setCouncils] = useState<Council[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editNote, setEditNote] = useState("");
  const [newName, setNewName] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newNote, setNewNote] = useState("");

  const fetchCouncils = async () => {
    try {
      const res = await fetch("/api/admin/councils");
      const data = await res.json();
      setCouncils(data);
    } catch {
      toast.error("Failed to fetch councils");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCouncils();
  }, []);

  const addCouncil = async () => {
    if (!newName.trim() || !newDisplayName.trim()) {
      toast.error("Name and display name are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/councils", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          displayName: newDisplayName.trim(),
          note: newNote.trim() || undefined,
          order: councils.length,
        }),
      });
      if (res.ok) {
        toast.success("Council added");
        setNewName("");
        setNewDisplayName("");
        setNewNote("");
        setAdding(false);
        fetchCouncils();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add council");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const updateCouncil = async (id: string, updates: Partial<Council>) => {
    try {
      const res = await fetch(`/api/admin/councils/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        fetchCouncils();
      } else {
        toast.error("Failed to update council");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim() || !editDisplayName.trim()) {
      toast.error("Name and display name are required");
      return;
    }
    await updateCouncil(id, {
      name: editName.trim(),
      displayName: editDisplayName.trim(),
      note: editNote.trim() || undefined,
    });
    toast.success("Council updated");
    setEditingId(null);
  };

  const deleteCouncil = async (id: string) => {
    if (!confirm("Delete this council?")) return;
    try {
      const res = await fetch(`/api/admin/councils/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Council deleted");
        fetchCouncils();
      } else {
        toast.error("Failed to delete council");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const startEdit = (council: Council) => {
    setEditingId(council._id);
    setEditName(council.name);
    setEditDisplayName(council.displayName);
    setEditNote(council.note || "");
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Councils</h1>
            <p className="text-sm text-text-muted mt-1">
              Manage the &quot;Accepted By&quot; list shown on the website and booking form.
            </p>
          </div>
          <Button onClick={() => setAdding(true)} disabled={adding} className="font-medium">
            <Plus className="w-4 h-4 mr-1" />
            Add Council
          </Button>
        </div>

        {/* Add form */}
        {adding && (
          <div className="bg-navy-light border border-white/8 rounded-xl p-5 mb-6 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-4">New Council</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <Label className="text-xs">Short Name</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Southend-on-Sea"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Full Display Name</Label>
                <Input
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="e.g. Southend-on-Sea City Council"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Note (optional)</Label>
                <Input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="e.g. Selected boroughs only"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addCouncil} disabled={saving} size="sm" className="font-medium">
                {saving ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Check className="w-3.5 h-3.5 mr-1" />}
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAdding(false);
                  setNewName("");
                  setNewDisplayName("");
                  setNewNote("");
                }}
                className="font-medium"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Council list */}
        <div className="bg-navy-light border border-white/8 rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left text-xs font-semibold text-text-muted px-6 py-3 w-8"></th>
                <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">Short Name</th>
                <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">Display Name (Booking Form)</th>
                <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">Note</th>
                <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-text-muted px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-6 py-3">
                          <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : councils.map((council) => (
                    <tr key={council._id} className="border-b border-white/5 hover:bg-white/3">
                      <td className="px-6 py-3">
                        <GripVertical className="w-3.5 h-3.5 text-text-muted/50" />
                      </td>
                      {editingId === council._id ? (
                        <>
                          <td className="px-6 py-2">
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="h-8 text-sm"
                            />
                          </td>
                          <td className="px-6 py-2">
                            <Input
                              value={editDisplayName}
                              onChange={(e) => setEditDisplayName(e.target.value)}
                              className="h-8 text-sm"
                            />
                          </td>
                          <td className="px-6 py-2">
                            <Input
                              value={editNote}
                              onChange={(e) => setEditNote(e.target.value)}
                              className="h-8 text-sm"
                              placeholder="Optional"
                            />
                          </td>
                          <td className="px-6 py-3">
                            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                              council.active
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                            }`}>
                              {council.active ? "Active" : "Hidden"}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => saveEdit(council._id)}
                                title="Save"
                                className="p-1.5 rounded-md hover:bg-emerald-500/10 text-text-muted hover:text-emerald-400 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                title="Cancel"
                                className="p-1.5 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-3 text-sm text-white font-medium">
                            {council.name}
                          </td>
                          <td className="px-6 py-3 text-sm text-text-muted">
                            {council.displayName}
                          </td>
                          <td className="px-6 py-3 text-sm text-text-muted italic">
                            {council.note || "—"}
                          </td>
                          <td className="px-6 py-3">
                            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                              council.active
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                            }`}>
                              {council.active ? "Active" : "Hidden"}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => startEdit(council)}
                                title="Edit"
                                className="p-1.5 rounded-md hover:bg-white/5 text-text-muted hover:text-white transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  updateCouncil(council._id, { active: !council.active })
                                }
                                title={council.active ? "Hide" : "Show"}
                                className="p-1.5 rounded-md hover:bg-white/5 text-text-muted hover:text-white transition-colors"
                              >
                                {council.active ? (
                                  <EyeOff className="w-3.5 h-3.5" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => deleteCouncil(council._id)}
                                title="Delete"
                                className="p-1.5 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
              {!loading && councils.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-muted text-sm">
                    No councils added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
