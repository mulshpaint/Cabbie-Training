"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import {
  CalendarDays,
  ClipboardList,
  MessageSquare,
  Users,
} from "lucide-react";
import { format } from "date-fns";

interface Stats {
  totalBookingsThisMonth: number;
  upcomingCourses: number;
  unreadContacts: number;
  totalDriversTrained: number;
}

interface RecentBooking {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  createdAt: string;
  course?: {
    date: string;
    type: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/bookings?limit=10"),
        ]);
        const statsData = await statsRes.json();
        const bookingsData = await bookingsRes.json();
        setStats(statsData);
        setRecentBookings(bookingsData.bookings || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statCards = [
    {
      label: "Bookings This Month",
      value: stats?.totalBookingsThisMonth ?? "—",
      icon: ClipboardList,
      color: "text-accent-blue",
    },
    {
      label: "Upcoming Courses",
      value: stats?.upcomingCourses ?? "—",
      icon: CalendarDays,
      color: "text-emerald-400",
    },
    {
      label: "Unread Messages",
      value: stats?.unreadContacts ?? "—",
      icon: MessageSquare,
      color: "text-amber",
    },
    {
      label: "Drivers Trained",
      value: stats?.totalDriversTrained ?? "—",
      icon: Users,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-extrabold text-white mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-navy-light border border-white/8 rounded-xl p-5 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-text-muted font-medium">
                  {card.label}
                </span>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className="text-3xl font-extrabold text-white">
                {loading ? (
                  <div className="h-9 w-16 bg-white/5 rounded animate-pulse" />
                ) : (
                  card.value
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-navy-light border border-white/8 rounded-xl shadow-lg">
          <div className="px-6 py-4 border-b border-white/8">
            <h2 className="text-lg font-bold text-white">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">
                    Name
                  </th>
                  <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">
                    Email
                  </th>
                  <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">
                    Course Date
                  </th>
                  <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-text-muted px-6 py-3">
                    Booked
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="px-6 py-3">
                          <div className="h-4 w-28 bg-white/5 rounded animate-pulse" />
                        </td>
                        <td className="px-6 py-3">
                          <div className="h-4 w-36 bg-white/5 rounded animate-pulse" />
                        </td>
                        <td className="px-6 py-3">
                          <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                        </td>
                        <td className="px-6 py-3">
                          <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
                        </td>
                        <td className="px-6 py-3">
                          <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
                        </td>
                      </tr>
                    ))
                  : recentBookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="border-b border-white/5 hover:bg-white/3"
                      >
                        <td className="px-6 py-3 text-sm text-white font-medium">
                          {booking.firstName} {booking.lastName}
                        </td>
                        <td className="px-6 py-3 text-sm text-text-muted">
                          {booking.email}
                        </td>
                        <td className="px-6 py-3 text-sm text-text-muted">
                          {booking.course
                            ? booking.course.type === "flexible"
                              ? "Flexible"
                              : format(
                                  new Date(booking.course.date),
                                  "d MMM yyyy"
                                )
                            : "—"}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                              booking.status === "paid"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : booking.status === "confirmed"
                                  ? "bg-accent-blue/10 text-accent-blue"
                                  : booking.status === "cancelled"
                                    ? "bg-red-500/10 text-red-400"
                                    : "bg-amber/10 text-amber"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-text-muted">
                          {format(new Date(booking.createdAt), "d MMM yyyy")}
                        </td>
                      </tr>
                    ))}
                {!loading && recentBookings.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-text-muted text-sm"
                    >
                      No bookings yet
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
