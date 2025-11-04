"use client";

import React, { useState } from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<string>; // confirmDelete now returns a message
  loading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: DeleteConfirmModalProps) {
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    const result = await onConfirm();
    setMessage(result);

    // auto-close after 1.5s if success
    if (!result.toLowerCase().includes("error")) {
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h2>

        {!message ? (
          <>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this design? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </>
        ) : (
          <div
            className={`p-4 rounded-xl text-center ${
              message.toLowerCase().includes("error")
                ? "bg-red-50 border border-red-300 text-red-700"
                : "bg-green-50 border border-green-300 text-green-700"
            }`}
          >
            {message.toLowerCase().includes("error") ? (
              <svg
                className="w-6 h-6 mx-auto mb-2 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 
                     9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 mx-auto mb-2 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 
                     9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
