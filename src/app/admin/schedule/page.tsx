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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Repeat,
  RefreshCw,
  CalendarDays,
  ChevronDown,
  Calendar,
  BanIcon,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { format, parseISO } from "date-fns";
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
  seriesId?: string;
}

interface BlackoutPeriod {
  start: string;
  end: string;
  reason?: string;
}

interface Series {
  _id: string;
  dayOfWeek: number;
  time: string;
  location: string;
  spotsTotal: number;
  price: number;
  type: "fixed" | "flexible";
  frequency: "weekly" | "fortnightly" | "monthly";
  weeksAhead: number;
  isActive: boolean;
  blackoutPeriods: BlackoutPeriod[];
}

interface DateGroup {
  dateKey: string;
  dateLabel: string;
  courses: Course[];
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function groupCoursesByDate(courses: Course[]): DateGroup[] {
  const fixed = courses.filter((c) => c.type === "fixed").sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const flexible = courses.filter((c) => c.type === "flexible");

  const groups: DateGroup[] = [];
  for (const course of fixed) {
    const d = parseISO(course.date);
    const dateKey = format(d, "yyyy-MM-dd");
    const existing = groups.find((g) => g.dateKey === dateKey);
    if (existing) {
      existing.courses.push(course);
    } else {
      groups.push({
        dateKey,
        dateLabel: format(d, "EEEE, d MMMM yyyy"),
        courses: [course],
      });
    }
  }

  if (flexible.length > 0) {
    groups.push({ dateKey: "flexible", dateLabel: "Flexible / Any Date", courses: flexible });
  }
  return groups;
}

export default function AdminSchedulePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingSeries, setLoadingSeries] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [expandedSeries, setExpandedSeries] = useState<string[]>([]);

  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [seriesDialogOpen, setSeriesDialogOpen] = useState(false);
  const [blackoutDialogOpen, setBlackoutDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editingSeriesId, setEditingSeriesId] = useState<string | null>(null);
  const [blackoutTargetId, setBlackoutTargetId] = useState<string | null>(null);

  const defaultCourse = {
    date: "",
    time: "09:00",
    location: "Rochford, Essex",
    spotsTotal: 8,
    price: 65,
    type: "fixed" as "fixed" | "flexible",
  };

  const defaultSeriesForm = {
    dayOfWeek: 6,
    time: "09:00",
    location: "Rochford, Essex",
    spotsTotal: 8,
    price: 65,
    type: "fixed" as "fixed" | "flexible",
    frequency: "weekly" as "weekly" | "fortnightly" | "monthly",
    weeksAhead: 8,
    startDate: new Date().toISOString().split("T")[0],
  };

  const [courseForm, setCourseForm] = useState(defaultCourse);
  const [seriesForm, setSeriesForm] = useState(defaultSeriesForm);
  const [blackoutForm, setBlackoutForm] = useState({ start: "", end: "", reason: "" });

  const fetchAll = async () => {
    setLoadingCourses(true);
    setLoadingSeries(true);
    try {
      const [cRes, sRes] = await Promise.all([
        fetch("/api/admin/courses"),
        fetch("/api/admin/series"),
      ]);
      const [cData, sData] = await Promise.all([cRes.json(), sRes.json()]);
      setCourses(Array.isArray(cData) ? cData : []);
      setSeries(Array.isArray(sData) ? sData : []);
    } catch {
      toast.error("Failed to load schedule");
    } finally {
      setLoadingCourses(false);
      setLoadingSeries(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const resetCourseForm = () => {
    setCourseForm(defaultCourse);
    setEditingCourseId(null);
  };

  const resetSeriesForm = () => {
    setSeriesForm(defaultSeriesForm);
    setEditingSeriesId(null);
  };

  const openEditCourse = (course: Course) => {
    const d = new Date(course.date);
    setCourseForm({
      date: course.date.slice(0, 10),
      time: `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`,
      location: course.location,
      spotsTotal: course.spotsTotal,
      price: course.price,
      type: course.type,
    });
    setEditingCourseId(course._id);
    setCourseDialogOpen(true);
  };

  const openEditSeries = (s: Series) => {
    setSeriesForm({
      dayOfWeek: s.dayOfWeek,
      time: s.time,
      location: s.location,
      spotsTotal: s.spotsTotal,
      price: s.price,
      type: s.type,
      frequency: s.frequency || "weekly",
      weeksAhead: s.weeksAhead,
      startDate: new Date().toISOString().split("T")[0],
    });
    setEditingSeriesId(s._id);
    setSeriesDialogOpen(true);
  };

  const saveCourse = async () => {
    setSaving(true);
    try {
      const url = editingCourseId ? `/api/admin/courses/${editingCourseId}` : "/api/admin/courses";
      const method = editingCourseId ? "PATCH" : "POST";
      const { time, ...rest } = courseForm;
      const dateWithTime = courseForm.date && courseForm.time
        ? `${courseForm.date}T${courseForm.time}:00`
        : courseForm.date;
      const payload = { ...rest, date: dateWithTime, spotsRemaining: editingCourseId ? undefined : courseForm.spotsTotal };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        toast.success(editingCourseId ? "Course updated" : "Course created");
        setCourseDialogOpen(false);
        resetCourseForm();
        fetchAll();
      } else {
        toast.error("Failed to save course");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const saveSeries = async () => {
    setSaving(true);
    try {
      const url = editingSeriesId ? `/api/admin/series/${editingSeriesId}` : "/api/admin/series";
      const method = editingSeriesId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(seriesForm) });
      if (res.ok) {
        if (!editingSeriesId) {
          const data = await res.json();
          toast.success(`Recurring pattern created — ${data.coursesCreated} courses generated`);
        } else {
          toast.success("Pattern updated");
        }
        setSeriesDialogOpen(false);
        resetSeriesForm();
        fetchAll();
      } else {
        toast.error("Failed to save pattern");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Course deleted"); fetchAll(); }
    } catch { toast.error("Failed to delete"); }
  };

  const toggleCourseActive = async (course: Course) => {
    try {
      const res = await fetch(`/api/admin/courses/${course._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !course.active }),
      });
      if (res.ok) { toast.success(course.active ? "Deactivated" : "Activated"); fetchAll(); }
    } catch { toast.error("Failed to update"); }
  };

  const toggleSeriesActive = async (s: Series) => {
    try {
      const res = await fetch(`/api/admin/series/${s._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !s.isActive }),
      });
      if (res.ok) { toast.success(s.isActive ? "Pattern paused" : "Pattern activated"); fetchAll(); }
    } catch { toast.error("Failed to update"); }
  };

  const deleteSeries = async (s: Series) => {
    if (!confirm("Delete this recurring pattern?")) return;
    const deleteFuture = confirm("Also delete all future unbooked courses from this pattern?");
    try {
      const res = await fetch(`/api/admin/series/${s._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleteFutureCourses: deleteFuture }),
      });
      if (res.ok) { toast.success("Pattern deleted"); fetchAll(); }
    } catch { toast.error("Failed to delete"); }
  };

  const addBlackout = async () => {
    if (!blackoutTargetId || !blackoutForm.start || !blackoutForm.end) {
      toast.error("Please fill in start and end dates");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/series/${blackoutTargetId}/blackouts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blackoutForm),
      });
      if (res.ok) {
        toast.success("Blackout added — courses in range deactivated");
        setBlackoutDialogOpen(false);
        setBlackoutForm({ start: "", end: "", reason: "" });
        fetchAll();
      } else { toast.error("Failed to add blackout"); }
    } catch { toast.error("Something went wrong"); }
    finally { setSaving(false); }
  };

  const removeBlackout = async (seriesId: string, index: number) => {
    if (!confirm("Remove this blackout? Courses will be re-activated.")) return;
    try {
      const res = await fetch(`/api/admin/series/${seriesId}/blackouts`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index }),
      });
      if (res.ok) { toast.success("Blackout removed"); fetchAll(); }
    } catch { toast.error("Failed to remove blackout"); }
  };

  const triggerGeneration = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/series/generate", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        toast.success(`Generated ${data.coursesGenerated} new course${data.coursesGenerated !== 1 ? "s" : ""}`);
        fetchAll();
      }
    } catch { toast.error("Failed to generate"); }
    finally { setGenerating(false); }
  };

  const toggleExpandSeries = (id: string) => {
    setExpandedSeries((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const dateGroups = groupCoursesByDate(courses);
  const seriesCourseCounts = series.map((s) => ({
    id: s._id,
    count: courses.filter((c) => c.seriesId === s._id).length,
  }));

  const loading = loadingCourses || loadingSeries;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Schedule</h1>
            <p className="text-text-muted text-sm mt-0.5">Manage recurring patterns and individual course dates</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={triggerGeneration}
              disabled={generating}
              className="font-bold"
            >
              {generating ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-1.5" />}
              Generate Ahead
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="font-bold">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Entry
                  <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem
                  onClick={() => { resetSeriesForm(); setSeriesDialogOpen(true); }}
                  className="cursor-pointer"
                >
                  <Repeat className="w-4 h-4 mr-2 text-purple-400" />
                  Create Recurring Pattern
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => { resetCourseForm(); setCourseDialogOpen(true); }}
                  className="cursor-pointer"
                >
                  <CalendarDays className="w-4 h-4 mr-2 text-accent-blue" />
                  Add One-off Course
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Recurring Patterns */}
        <section className="mb-10">
          <h2 className="text-xs font-bold tracking-widest uppercase text-text-muted mb-3 flex items-center gap-2">
            <Repeat className="w-3.5 h-3.5 text-purple-400" />
            Recurring Patterns
          </h2>

          {loadingSeries ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-navy-light border border-white/8 rounded-xl p-5 animate-pulse h-20" />
              ))}
            </div>
          ) : series.length === 0 ? (
            <div className="bg-navy-light border border-dashed border-white/15 rounded-xl p-8 text-center">
              <Repeat className="w-8 h-8 text-white/20 mx-auto mb-3" />
              <p className="text-text-muted text-sm mb-3">No recurring patterns yet</p>
              <Button size="sm" variant="outline" onClick={() => { resetSeriesForm(); setSeriesDialogOpen(true); }}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Create Pattern
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {series.map((s) => {
                const isExpanded = expandedSeries.includes(s._id);
                const courseCount = seriesCourseCounts.find((x) => x.id === s._id)?.count ?? 0;
                return (
                  <div key={s._id} className="bg-navy-light border border-white/8 rounded-xl overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 p-2 rounded-lg bg-purple-500/10">
                            <Repeat className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-white font-bold">
                                {s.frequency === "fortnightly" ? "Fortnightly" : s.frequency === "monthly" ? "Monthly" : "Weekly"} {DAYS[s.dayOfWeek]}s at {s.time}
                              </h3>
                              <button
                                onClick={() => toggleSeriesActive(s)}
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                  s.isActive
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-red-500/10 text-red-400"
                                }`}
                              >
                                {s.isActive ? "Active" : "Paused"}
                              </button>
                            </div>
                            <p className="text-xs text-text-muted mt-0.5">
                              {s.location} &bull; {s.spotsTotal} spots &bull; £{s.price} &bull; {s.weeksAhead} weeks ahead
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setBlackoutTargetId(s._id);
                              setBlackoutDialogOpen(true);
                            }}
                            title="Add blackout period"
                            className="p-1.5 rounded-md hover:bg-amber-500/10 text-text-muted hover:text-amber-400 transition-colors"
                          >
                            <BanIcon className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditSeries(s)}
                            className="p-1.5 rounded-md hover:bg-white/5 text-text-muted hover:text-white transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteSeries(s)}
                            className="p-1.5 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleExpandSeries(s._id)}
                            className="ml-1 p-1.5 rounded-md hover:bg-white/5 text-text-muted hover:text-white transition-colors flex items-center gap-1 text-xs"
                          >
                            {courseCount} course{courseCount !== 1 ? "s" : ""}
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Blackout periods */}
                      {s.blackoutPeriods.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {s.blackoutPeriods.map((bp, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1">
                              <BanIcon className="w-3 h-3 text-amber-400" />
                              <span className="text-xs text-amber-300">
                                {new Date(bp.start).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – {new Date(bp.end).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                {bp.reason && ` (${bp.reason})`}
                              </span>
                              <button
                                onClick={() => removeBlackout(s._id, idx)}
                                className="text-amber-500 hover:text-red-400 transition-colors ml-1"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Expanded course list */}
                    {isExpanded && (
                      <div className="border-t border-white/8 bg-white/2 divide-y divide-white/5">
                        {courses
                          .filter((c) => c.seriesId === s._id)
                          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                          .map((c) => (
                            <div key={c._id} className="flex items-center justify-between px-5 py-2.5 text-sm">
                              <div className="flex items-center gap-3">
                                <span className="text-white font-medium w-36">
                                  {format(parseISO(c.date), "d MMM yyyy, HH:mm")}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                  c.active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                                }`}>
                                  {c.active ? "Active" : "Inactive"}
                                </span>
                                <span className="text-text-muted text-xs">{c.spotsRemaining}/{c.spotsTotal} spots</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button onClick={() => toggleCourseActive(c)} className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-white transition-colors text-xs px-2">
                                  Toggle
                                </button>
                                <button onClick={() => openEditCourse(c)} className="p-1.5 rounded hover:bg-white/5 text-text-muted hover:text-white transition-colors">
                                  <Pencil className="w-3 h-3" />
                                </button>
                                <button onClick={() => deleteCourse(c._id)} className="p-1.5 rounded hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        {courses.filter((c) => c.seriesId === s._id).length === 0 && (
                          <div className="px-5 py-4 text-xs text-text-muted">No courses generated yet — click &quot;Generate Ahead&quot;</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Upcoming Course Instances grouped by date */}
        <section>
          <h2 className="text-xs font-bold tracking-widest uppercase text-text-muted mb-3 flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5 text-accent-blue" />
            Upcoming Dates
          </h2>

          {loadingCourses ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-navy-light border border-white/8 rounded-xl p-5 animate-pulse h-24" />
              ))}
            </div>
          ) : dateGroups.length === 0 ? (
            <div className="bg-navy-light border border-dashed border-white/15 rounded-xl p-8 text-center">
              <CalendarDays className="w-8 h-8 text-white/20 mx-auto mb-3" />
              <p className="text-text-muted text-sm mb-3">No courses scheduled yet</p>
              <Button size="sm" variant="outline" onClick={() => { resetCourseForm(); setCourseDialogOpen(true); }}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Course
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {dateGroups.map((group) => (
                <div key={group.dateKey} className="bg-navy-light border border-white/8 rounded-xl overflow-hidden">
                  {/* Date header */}
                  <div className="px-5 py-3 border-b border-white/8 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-accent-blue" />
                    <span className="text-sm font-bold text-white">{group.dateLabel}</span>
                    <span className="text-xs text-text-muted">
                      {group.courses.length} session{group.courses.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Time slots */}
                  <div className="divide-y divide-white/5">
                    {group.courses
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((course) => (
                        <div key={course._id} className="flex items-center justify-between px-5 py-3 hover:bg-white/2 transition-colors">
                          <div className="flex items-center gap-4">
                            {/* Time block */}
                            <div className="text-white font-bold text-sm w-14 shrink-0">
                              {course.type === "flexible" ? "Any" : format(parseISO(course.date), "HH:mm")}
                            </div>

                            {/* Badges */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                course.seriesId
                                  ? "bg-purple-500/10 text-purple-400"
                                  : "bg-accent-blue/10 text-accent-blue"
                              }`}>
                                {course.seriesId ? (
                                  <span className="flex items-center gap-1"><Repeat className="w-2.5 h-2.5" />Series</span>
                                ) : "One-off"}
                              </span>
                              <button
                                onClick={() => toggleCourseActive(course)}
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                  course.active
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-red-500/10 text-red-400"
                                }`}
                              >
                                {course.active ? "Active" : "Inactive"}
                              </button>
                            </div>

                            {/* Stats */}
                            <div className="hidden sm:flex items-center gap-4 text-xs text-text-muted">
                              <span>{course.spotsRemaining}/{course.spotsTotal} spots</span>
                              <span className="font-semibold text-white">£{course.price}</span>
                              <span>{course.location}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => openEditCourse(course)}
                              className="p-1.5 rounded-md hover:bg-white/5 text-text-muted hover:text-white transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteCourse(course._id)}
                              className="p-1.5 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── One-off Course Dialog ── */}
        <Dialog open={courseDialogOpen} onOpenChange={(o) => { setCourseDialogOpen(o); if (!o) resetCourseForm(); }}>
          <DialogContent className="bg-navy-light border-white/8">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingCourseId ? "Edit Course" : "Add One-off Course"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={courseForm.date} onChange={(e) => setCourseForm({ ...courseForm, date: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input type="time" value={courseForm.time} onChange={(e) => setCourseForm({ ...courseForm, time: e.target.value })} className="mt-1" />
                </div>
              </div>
              <div>
                <Label>Location</Label>
                <Input value={courseForm.location} onChange={(e) => setCourseForm({ ...courseForm, location: e.target.value })} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Spots</Label>
                  <Input type="number" value={courseForm.spotsTotal} onChange={(e) => setCourseForm({ ...courseForm, spotsTotal: parseInt(e.target.value) })} className="mt-1" />
                </div>
                <div>
                  <Label>Price (£)</Label>
                  <Input type="number" value={courseForm.price} onChange={(e) => setCourseForm({ ...courseForm, price: parseInt(e.target.value) })} className="mt-1" />
                </div>
              </div>
              <div>
                <Label>Type</Label>
                <Select value={courseForm.type} onValueChange={(v: "fixed" | "flexible") => setCourseForm({ ...courseForm, type: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Date</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={saveCourse} disabled={saving} className="w-full font-bold">
                {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
                {editingCourseId ? "Update Course" : "Create Course"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Series / Pattern Dialog ── */}
        <Dialog open={seriesDialogOpen} onOpenChange={(o) => { setSeriesDialogOpen(o); if (!o) resetSeriesForm(); }}>
          <DialogContent className="bg-navy-light border-white/8">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingSeriesId ? "Edit Recurring Pattern" : "Create Recurring Pattern"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Day of Week</Label>
                  <Select value={seriesForm.dayOfWeek.toString()} onValueChange={(v) => setSeriesForm({ ...seriesForm, dayOfWeek: parseInt(v) })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DAYS.map((day, idx) => (
                        <SelectItem key={idx} value={idx.toString()}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Time</Label>
                  <Input type="time" value={seriesForm.time} onChange={(e) => setSeriesForm({ ...seriesForm, time: e.target.value })} className="mt-1" />
                </div>
              </div>
              <div>
                <Label>Location</Label>
                <Input value={seriesForm.location} onChange={(e) => setSeriesForm({ ...seriesForm, location: e.target.value })} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Spots</Label>
                  <Input type="number" value={seriesForm.spotsTotal} onChange={(e) => setSeriesForm({ ...seriesForm, spotsTotal: parseInt(e.target.value) })} className="mt-1" />
                </div>
                <div>
                  <Label>Price (£)</Label>
                  <Input type="number" value={seriesForm.price} onChange={(e) => setSeriesForm({ ...seriesForm, price: parseInt(e.target.value) })} className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select value={seriesForm.type} onValueChange={(v: "fixed" | "flexible") => setSeriesForm({ ...seriesForm, type: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Date</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Frequency</Label>
                  <Select value={seriesForm.frequency} onValueChange={(v: "weekly" | "fortnightly" | "monthly") => setSeriesForm({ ...seriesForm, frequency: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="fortnightly">Fortnightly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Weeks Ahead</Label>
                  <Input type="number" min="1" max="12" value={seriesForm.weeksAhead} onChange={(e) => setSeriesForm({ ...seriesForm, weeksAhead: parseInt(e.target.value) })} className="mt-1" />
                </div>
              </div>
              {!editingSeriesId && (
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" value={seriesForm.startDate} onChange={(e) => setSeriesForm({ ...seriesForm, startDate: e.target.value })} className="mt-1" />
                </div>
              )}
              <Button onClick={saveSeries} disabled={saving} className="w-full font-bold">
                {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
                {editingSeriesId ? "Update Pattern" : "Create Pattern"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Blackout Dialog ── */}
        <Dialog open={blackoutDialogOpen} onOpenChange={(o) => { setBlackoutDialogOpen(o); if (!o) setBlackoutTargetId(null); }}>
          <DialogContent className="bg-navy-light border-white/8">
            <DialogHeader>
              <DialogTitle className="text-white">Add Blackout Period</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" value={blackoutForm.start} onChange={(e) => setBlackoutForm({ ...blackoutForm, start: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input type="date" value={blackoutForm.end} onChange={(e) => setBlackoutForm({ ...blackoutForm, end: e.target.value })} className="mt-1" />
                </div>
              </div>
              <div>
                <Label>Reason (optional)</Label>
                <Input value={blackoutForm.reason} onChange={(e) => setBlackoutForm({ ...blackoutForm, reason: e.target.value })} placeholder="e.g. Christmas break" className="mt-1" />
              </div>
              <Button onClick={addBlackout} disabled={saving} className="w-full font-bold">
                {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
                Add Blackout
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  );
}
