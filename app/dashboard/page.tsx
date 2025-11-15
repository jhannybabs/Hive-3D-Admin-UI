"use client";

import { useEffect, useState } from "react";

interface Summary {
  totalUsers: number;
  totalOrders: number;
  totalDesigns: number;
}

interface Activity {
  type: string;
  message: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        // Use API proxy routes for HTTPS compatibility (no mixed content issues)
        const [resSummary, resActivities] = await Promise.all([
          fetch("/api/proxy/dashboard/summary"),
          fetch("/api/proxy/dashboard/activities"),
        ]);

        if (!resSummary.ok || !resActivities.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const dataSummary = await resSummary.json();
        const dataActivities = await resActivities.json();

        setSummary(dataSummary);
        setActivities(dataActivities);
      } catch (err: any) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-4 sm:mb-6 text-right lg:text-left ml-16 lg:ml-0">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-yellow-700">Total Users</h2>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-900 mt-2">
            {summary?.totalUsers ?? 0}
          </p>
          <span className="text-xs text-yellow-600">Active this month</span>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-yellow-700">
            Total Designs
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-900 mt-2">
            {summary?.totalDesigns ?? 0}
          </p>
          <span className="text-xs text-yellow-600">Updated recently</span>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-yellow-700">
            Total Orders
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-900 mt-2">
            {summary?.totalOrders ?? 0}
          </p>
          <span className="text-xs text-yellow-600">Tracked automatically</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 sm:mt-10">
        <h2 className="text-base sm:text-lg font-bold text-yellow-700 mb-3 sm:mb-4">
          Recent Activity
        </h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow p-4 sm:p-5 overflow-x-auto">
          {loading && <p className="text-yellow-600">Loading...</p>}
          {error && <p className="text-red-600">Error: {error}</p>}
          {!loading && !error && (
            <ul className="divide-y divide-yellow-200">
              {activities.length === 0 && (
                <li className="p-4 text-yellow-600">No recent activity</li>
              )}
              {activities.map((act, idx) => (
                <li
                  key={idx}
                  className="p-4 hover:bg-yellow-100 transition-colors"
                >
                  <span className="font-medium text-yellow-900">
                    {act.message}
                  </span>
                  <span className="block text-xs text-yellow-600">
                    {new Date(act.createdAt!).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
