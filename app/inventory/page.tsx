"use client";

import { useEffect, useState } from "react";

interface InventoryReport {
  period: string;
  totalIn: number;
  totalOut: number;
  netChange: number;
}

interface InventoryItem {
  id: string;
  name: string;
  pid: number;
  stock: number;
  status: string;
  reports: InventoryReport[];
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch(`/api/inventory/combined/${period}`);
        const data: InventoryItem[] = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, [period]);

  if (loading) {
    return <p className="text-center">Loading inventory...</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <select
          value={period}
          onChange={(e) =>
            setPeriod(e.target.value as "daily" | "weekly" | "monthly")
          }
          className="border px-3 py-2 rounded-lg"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Design</th>
              <th className="p-3">PID</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Net Change ({period})</th>
              <th className="p-3">Total In</th>
              <th className="p-3">Total Out</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const latestReport = item.reports[item.reports.length - 1];
              return (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">{item.pid}</td>
                  <td className="p-3">
                    <span
                      className={
                        item.stock === 0
                          ? "text-red-600 font-semibold"
                          : item.stock < 5
                          ? "text-yellow-600 font-semibold"
                          : "text-green-600 font-semibold"
                      }
                    >
                      {item.stock}
                    </span>
                  </td>
                  <td className="p-3">
                    {latestReport ? latestReport.netChange : 0}
                  </td>
                  <td className="p-3">
                    {latestReport ? latestReport.totalIn : 0}
                  </td>
                  <td className="p-3">
                    {latestReport ? latestReport.totalOut : 0}
                  </td>
                  <td className="p-3">{item.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
