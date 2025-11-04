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

        const [resSummary, resActivities] = await Promise.all([
          fetch("http://10.34.126.49:2701/dashboard/summary"),
          fetch("http://10.34.126.49:2701/dashboard/activities"),
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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-yellow-600 mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow p-6">
          <h2 className="text-sm font-semibold text-yellow-700">Total Users</h2>
          <p className="text-3xl font-bold text-yellow-900 mt-2">
            {summary?.totalUsers ?? 0}
          </p>
          <span className="text-xs text-yellow-600">Active this month</span>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow p-6">
          <h2 className="text-sm font-semibold text-yellow-700">
            Total Designs
          </h2>
          <p className="text-3xl font-bold text-yellow-900 mt-2">
            {summary?.totalDesigns ?? 0}
          </p>
          <span className="text-xs text-yellow-600">Updated recently</span>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow p-6">
          <h2 className="text-sm font-semibold text-yellow-700">
            Total Orders
          </h2>
          <p className="text-3xl font-bold text-yellow-900 mt-2">
            {summary?.totalOrders ?? 0}
          </p>
          <span className="text-xs text-yellow-600">Tracked automatically</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-yellow-700 mb-4">
          Recent Activity
        </h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow p-5">
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
