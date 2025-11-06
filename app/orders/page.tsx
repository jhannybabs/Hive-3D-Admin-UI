"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import { fetchOrders } from "@/lib/state/slices/ordersAction";

export default function OrdersPage() {
  const {
    value: orders,
    loading,
    error,
  } = useSelector((state: RootState) => state.order);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filteredOrders = orders
    .filter((order) => {
      const matchesStatus =
        filterStatus === "all" || order.status === filterStatus;
      const matchesSearch =
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.userId.fullName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        order.userId.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      return new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime();
    });

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedOrder) return;

    setUpdatingStatus(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      await dispatch(fetchOrders());
    } catch (err: any) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mb-4 mx-auto"></div>
          <p className="text-gray-600 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 flex items-center justify-center p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-xl max-w-md">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-red-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-800 font-medium">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
      <div className="bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-30">
        <div className="px-6 lg:px-8 xl:px-12 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Orders Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Total: {filteredOrders.length}{" "}
                {filteredOrders.length === 1 ? "order" : "orders"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all text-sm"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="awaiting payment">Awaiting Payment</option>
                <option value="awaiting cod">Awaiting COD</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 lg:px-8 xl:px-12 py-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-medium text-yellow-900/70 mb-1">
                        Order ID
                      </p>
                      <p className="font-mono text-sm font-bold text-white">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "paid"
                          ? "bg-purple-100 text-purple-700"
                          : order.status === "processing"
                          ? "bg-orange-100 text-orange-700"
                          : order.status === "awaiting payment"
                          ? "bg-amber-100 text-amber-700"
                          : order.status === "awaiting cod"
                          ? "bg-teal-100 text-teal-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {order.userId.fullName}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {order.userId.email}
                      </p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Total Amount
                      </span>
                      <span className="text-lg font-bold text-yellow-700">
                        ₱
                        {order.totalAmount.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        Payment Method
                      </span>
                      <span className="text-xs font-medium text-gray-700 uppercase">
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "Item" : "Items"}
                    </p>
                    <div className="space-y-2">
                      {order.items.slice(0, 2).map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span className="text-gray-700 truncate flex-1">
                            {item.designId.designName}
                          </span>
                          <span className="text-gray-500 text-xs">
                            ×{item.quantity}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-xs text-yellow-600 ml-4">
                          +{order.items.length - 2} more
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-gray-200">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {new Date(order.orderedAt).toLocaleDateString("en-PH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="px-5 pb-4">
                  <button className="w-full py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-yellow-400 to-orange-400 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Order Details</h2>
                <p className="text-yellow-900/70 text-sm font-mono">
                  #{selectedOrder._id}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {selectedOrder.status !== "cancelled" ? (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Update Order Status
                    </p>
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        selectedOrder.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : selectedOrder.status === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : selectedOrder.status === "paid"
                          ? "bg-purple-100 text-purple-700"
                          : selectedOrder.status === "processing"
                          ? "bg-orange-100 text-orange-700"
                          : selectedOrder.status === "awaiting payment"
                          ? "bg-amber-100 text-amber-700"
                          : selectedOrder.status === "awaiting cod"
                          ? "bg-teal-100 text-teal-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      Current:{" "}
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      onClick={() => handleStatusChange("processing")}
                      disabled={
                        updatingStatus || selectedOrder.status === "processing"
                      }
                      className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                        selectedOrder.status === "processing"
                          ? "bg-orange-500 text-white cursor-not-allowed"
                          : "bg-white text-orange-600 border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-400 disabled:opacity-50"
                      }`}
                    >
                      {updatingStatus &&
                      selectedOrder.status !== "processing" ? (
                        <svg
                          className="animate-spin h-4 w-4 mx-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        "Processing"
                      )}
                    </button>
                    <button
                      onClick={() => handleStatusChange("paid")}
                      disabled={
                        updatingStatus || selectedOrder.status === "paid"
                      }
                      className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                        selectedOrder.status === "paid"
                          ? "bg-purple-500 text-white cursor-not-allowed"
                          : "bg-white text-purple-600 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-400 disabled:opacity-50"
                      }`}
                    >
                      {updatingStatus && selectedOrder.status !== "paid" ? (
                        <svg
                          className="animate-spin h-4 w-4 mx-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        "Paid"
                      )}
                    </button>
                    <button
                      onClick={() => handleStatusChange("shipped")}
                      disabled={
                        updatingStatus || selectedOrder.status === "shipped"
                      }
                      className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                        selectedOrder.status === "shipped"
                          ? "bg-blue-500 text-white cursor-not-allowed"
                          : "bg-white text-blue-600 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50"
                      }`}
                    >
                      {updatingStatus && selectedOrder.status !== "shipped" ? (
                        <svg
                          className="animate-spin h-4 w-4 mx-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        "Shipped"
                      )}
                    </button>
                    <button
                      onClick={() => handleStatusChange("delivered")}
                      disabled={
                        updatingStatus || selectedOrder.status === "delivered"
                      }
                      className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                        selectedOrder.status === "delivered"
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : "bg-white text-green-600 border-2 border-green-200 hover:bg-green-50 hover:border-green-400 disabled:opacity-50"
                      }`}
                    >
                      {updatingStatus &&
                      selectedOrder.status !== "delivered" ? (
                        <svg
                          className="animate-spin h-4 w-4 mx-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        "Delivered"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-red-800">
                        Order Cancelled
                      </p>
                      <p className="text-sm text-red-600">
                        This order has been cancelled and cannot be modified.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-yellow-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Customer Information
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedOrder.userId.fullName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.userId.email}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    Payment Details
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    ₱
                    {selectedOrder.totalAmount.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-sm text-gray-600 uppercase">
                    {selectedOrder.paymentMethod}
                  </p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Shipping Address
                </p>
                <p className="font-semibold text-gray-800">
                  {selectedOrder.shippingAddress.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedOrder.shippingAddress.street}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedOrder.shippingAddress.city},{" "}
                  {selectedOrder.shippingAddress.province}{" "}
                  {selectedOrder.shippingAddress.zip}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {selectedOrder.shippingAddress.phone}
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800 mb-4">
                  Order Items
                </p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any) => (
                    <div key={item._id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-gray-800">
                          {item.designId.designName}
                        </p>
                        <p className="font-bold text-yellow-700">
                          ₱
                          {(item.price * item.quantity).toLocaleString(
                            "en-PH",
                            { minimumFractionDigits: 2 }
                          )}
                        </p>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>Size: {item.size}</span>
                        <span>•</span>
                        <span>Color: {item.color}</span>
                        <span>•</span>
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <span>
                          ₱
                          {item.price.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-lg font-semibold text-gray-800 mb-4">
                  Order Timeline
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Order Created
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(selectedOrder.createdAt).toLocaleString(
                          "en-PH"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Order Placed
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(selectedOrder.orderedAt).toLocaleString(
                          "en-PH"
                        )}
                      </p>
                    </div>
                  </div>
                  {selectedOrder.cancelledAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-red-700">
                          Order Cancelled
                        </p>
                        <p className="text-xs text-red-500">
                          {new Date(selectedOrder.cancelledAt).toLocaleString(
                            "en-PH"
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {selectedOrder.status !== "cancelled" && (
              <div className="sticky bottom-0 bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-all"
                >
                  Close
                </button>
                <button
                  onClick={async () => {
                    setSavingChanges(true);
                    try {
                      await new Promise((resolve) => setTimeout(resolve, 2000));
                      await dispatch(fetchOrders());
                    } catch (err) {
                      console.error("Failed to save:", err);
                    } finally {
                      setSavingChanges(false);
                    }
                  }}
                  disabled={updatingStatus || savingChanges}
                  className="px-6 py-2 bg-white text-yellow-600 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {savingChanges ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
