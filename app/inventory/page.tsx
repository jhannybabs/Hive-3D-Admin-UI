"use client";

import { useEffect, useState, useMemo } from "react";

const LOW_STOCK_THRESHOLD = 5;

interface InventoryReport {
  period: string;
  totalSales: number;
  totalRestocks: number;
  totalCancelled: number;
  netChange: number;
}

interface InventoryItem {
  id: string;
  designId: string;
  name: string;
  stock: number;
  status: string;
  reports: InventoryReport[];
}

// Helper function to calculate totals from reports
function calculateReportTotals(reports: InventoryReport[]) {
  if (!Array.isArray(reports)) {
    return { sales: 0, restocks: 0, cancelled: 0, net: 0 };
  }
  return reports.reduce(
    (acc, r) => ({
      sales: acc.sales + (r.totalSales || 0),
      restocks: acc.restocks + (r.totalRestocks || 0),
      cancelled: acc.cancelled + (r.totalCancelled || 0),
      net: acc.net + (r.netChange || 0),
    }),
    { sales: 0, restocks: 0, cancelled: 0, net: 0 }
  );
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [backfilling, setBackfilling] = useState(false);
  const [hasCheckedBackfill, setHasCheckedBackfill] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/inventory/combined/${period}`);
        const data = await res.json();

        // Defensive guard
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          setItems([]);
        }

        // Auto-backfill on first load if there are no sales/cancellations
        if (!hasCheckedBackfill && !backfilling) {
          setHasCheckedBackfill(true);
          const hasNoSales = data.every((item: InventoryItem) => {
            const total = calculateReportTotals(item.reports);
            return total.sales === 0 && total.cancelled === 0;
          });

          // Check if we have delivered/cancelled orders that need backfilling
          if (hasNoSales || data.length === 0) {
            // Run backfill directly
            setBackfilling(true);
            try {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://192.168.254.106:2701";
              const backfillRes = await fetch(`${apiUrl}/orders/backfill-inventory`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });

              const backfillData = await backfillRes.json();
              
              if (backfillRes.ok && backfillData.response) {
                const result = backfillData.response;
                
                // Only refresh if we actually logged something
                if (result.totalProcessed > 0) {
                  // Refresh inventory data after backfill
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
              }
            } catch (backfillErr: any) {
              // Auto-backfill error
            } finally {
              setBackfilling(false);
            }
          }
        }
      } catch (err) {
        setError("Failed to load inventory. Please try again.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, hasCheckedBackfill]);

  // Memoized calculations for performance
  const overall = useMemo(() => {
    if (!Array.isArray(items)) {
      return { sales: 0, restocks: 0, cancelled: 0, lowStockCount: 0 };
    }
    return items.reduce(
      (acc, item) => {
        const total = calculateReportTotals(item.reports);
        acc.sales += total.sales;
        acc.restocks += total.restocks;
        acc.cancelled += total.cancelled;
        acc.lowStockCount += item.stock <= LOW_STOCK_THRESHOLD ? 1 : 0;
        return acc;
      },
      { sales: 0, restocks: 0, cancelled: 0, lowStockCount: 0 }
    );
  }, [items]);

  const lowStockItems = useMemo(
    () => items.filter((i) => i.stock <= LOW_STOCK_THRESHOLD),
    [items]
  );

  if (loading) {
    return (
      <p className="text-center py-8 text-gray-500">Loading inventory...</p>
    );
  }

  if (items.length === 0 && !error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4 text-right lg:text-left ml-16 lg:ml-0">Inventory Dashboard</h1>
        <p className="text-center py-8 text-gray-500">
          No inventory items found.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-right lg:text-left ml-16 lg:ml-0 whitespace-nowrap">Inventory Dashboard</h1>
        {backfilling && (
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            Auto-backfilling inventory records...
          </div>
        )}
        <select
          value={period}
          onChange={(e) =>
            setPeriod(e.target.value as "daily" | "weekly" | "monthly")
          }
          className="border px-3 py-2 rounded-lg shadow-sm"
          aria-label="Select reporting period"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-200 p-4 rounded-lg text-red-800">
          {error}
        </div>
      )}


      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-blue-100 border border-blue-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-blue-600 font-semibold text-sm">
            Total Sales ({period})
          </h3>
          <p className="text-3xl font-bold text-blue-800 mt-1">
            {overall.sales}
          </p>
        </div>
        <div className="bg-green-100 border border-green-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-green-600 font-semibold text-sm">
            Restocks ({period})
          </h3>
          <p className="text-3xl font-bold text-green-800 mt-1">
            {overall.restocks}
          </p>
        </div>
        <div className="bg-red-100 border border-red-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-red-600 font-semibold text-sm">
            Cancelled ({period})
          </h3>
          <p className="text-3xl font-bold text-red-800 mt-1">
            {overall.cancelled}
          </p>
        </div>
        <div className="bg-yellow-100 border border-yellow-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-yellow-700 font-semibold text-sm">
            Low Stock Designs
          </h3>
          <p className="text-3xl font-bold text-yellow-800 mt-1">
            {overall.lowStockCount}
          </p>
        </div>
      </div>

      {/* Low Stock Warning */}
      {lowStockItems.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h2 className="font-bold text-yellow-800 mb-2">
            Low Stock Alert ({lowStockItems.length})
          </h2>
          <ul className="list-disc ml-6 text-yellow-800">
            {lowStockItems.map((i) => (
              <li key={i.id}>
                {i.name} – <span className="font-semibold">{i.stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Inventory Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th scope="col" className="p-3">
                Design
              </th>
              <th scope="col" className="p-3">
                Stock
              </th>
              <th scope="col" className="p-3">
                Sales
              </th>
              <th scope="col" className="p-3">
                Restocks
              </th>
              <th scope="col" className="p-3">
                Cancelled
              </th>
              <th scope="col" className="p-3">
                Net Change
              </th>
              <th scope="col" className="p-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const total = calculateReportTotals(item.reports);

              return (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">
                    <span
                      className={`font-semibold ${
                        item.stock === 0
                          ? "text-red-600"
                          : item.stock <= LOW_STOCK_THRESHOLD
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.stock}
                    </span>
                  </td>
                  <td className="p-3 text-blue-600 font-semibold">
                    {total.sales}
                  </td>
                  <td className="p-3 text-green-600 font-semibold">
                    {total.restocks}
                  </td>
                  <td className="p-3 text-red-600 font-semibold">
                    {total.cancelled}
                  </td>
                  <td className="p-3 text-gray-700 font-semibold">
                    {total.net}
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
