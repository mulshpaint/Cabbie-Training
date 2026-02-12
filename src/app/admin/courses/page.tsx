"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Course {
  _id: string;
  date: string;
  location: string;
  spotsTotal: number;
  spotsRemaining: number;
  price: number;
  type: "fixed" | "flexible";
  active: boolean;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: "",
    time: "09:00",
    location: "Rochford, Essex",
    spotsTotal: 8,
    price: 65,
    type: "fixed" as "fixed" | "flexible",
  });

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/admin/courses");
      const data = await res.json();
      setCourses(data);
    } catch {
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const resetForm = () => {
    setFormData({ date: "", time: "09:00", location: "Rochford, Essex", spotsTotal: 8, price: 65, type: "fixed" });
    setEditingId(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editingId
        ? `/api/admin/courses/${editingId}`
        : "/api/admin/courses";
      const method = editingId ? "PATCH" : "POST";

      const { time, ...rest } = formData;
      const dateWithTime = formData.date && formData.time
        ? `${formData.date}T${formData.time}:00`
        : formData.date;
      const payload = {
        ...rest,
        date: dateWithTime,
        spotsRemaining: editingId ? undefined : formData.spotsTotal,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingId ? "Course updated" : "Course created");
        setDialogOpen(false);
        resetForm();
        fetchCourses();
      } else {
        toast.error("Failed to save course");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingId(course._id);
    const d = new Date(course.date);
    setFormData({
      date: course.date.slice(0, 10),
      time: `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`,
      location: course.location,
      spotsTotal: course.spotsTotal,
      price: course.price,
      type: course.type,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Course deleted");
        fetchCourses();
      } else {
        toast.error("Failed to delete course");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const toggleActive = async (course: Course) => {
    try {
      const res = await fetch(`/api/admin/courses/${course._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !course.active }),
      });
      if (res.ok) {
        toast.success(course.active ? "Course deactivated" : "Course activated");
        fetchCourses();
      }
    } catch {
      toast.error("Failed to update course");
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-white">Courses</h1>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="font-bold">
                <Plus className="w-4 h-4 mr-1" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-navy-light border-white/8">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingId ? "Edit Course" : "Add New Course"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Total Spots</Label>
                    <Input
                      type="number"
                      value={formData.spotsTotal}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          spotsTotal: parseInt(e.target.value),
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Price (£)</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseInt(e.target.value),
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(val: "fixed" | "flexible") =>
                      setFormData({ ...formData, type: val })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Date</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full font-bold"
                >
                  {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                  {editingId ? "Update Course" : "Create Course"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-navy-light border border-white/8 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">Date</th>
                  <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">Location</th>
                  <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">Spots</th>
                  <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">Price</th>
                  <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/5">
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-6 py-3">
                            <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : courses.map((course) => (
                      <tr key={course._id} className="border-b border-white/5 hover:bg-white/3">
                        <td className="px-6 py-3 text-sm text-white font-medium">
                          {course.type === "flexible"
                            ? "Flexible"
                            : format(new Date(course.date), "d MMM yyyy, HH:mm")}
                        </td>
                        <td className="px-6 py-3 text-sm text-text-muted">{course.location}</td>
                        <td className="px-6 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            course.type === "flexible"
                              ? "bg-purple-500/10 text-purple-400"
                              : "bg-accent-blue/10 text-accent-blue"
                          }`}>
                            {course.type}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-text-muted">
                          {course.spotsRemaining}/{course.spotsTotal}
                        </td>
                        <td className="px-6 py-3 text-sm text-white font-medium">£{course.price}</td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() => toggleActive(course)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer ${
                              course.active
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {course.active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(course)}
                              className="p-1.5 rounded-md hover:bg-white/5 text-text-muted hover:text-white transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(course._id)}
                              className="p-1.5 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                {!loading && courses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-text-muted text-sm">
                      No courses yet. Click &quot;Add Course&quot; to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
