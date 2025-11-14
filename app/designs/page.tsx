"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

interface Design {
  _id: string;
  designName: string;
  category: string;
  description: string;
  price: number;
  status: string;
  totalStock: number;
  imageUrl: string[];
}

export default function DesignsPage() {
  const router = useRouter();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/designs/get-all-designs`
        );
        setDesigns(res.data.response || []);
      } catch (err) {
        // Error fetching designs
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, []);

  const handleDelete = (designId: string) => {
    setSelectedId(designId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    setDeleting(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/designs/delete-design/${selectedId}`
      );

      setDesigns((prev) => prev.filter((d) => d._id !== selectedId));

      // dito na lang natin ipapasa yung message sa modal (next step)
      return res.data.message || "Design deleted!";
    } catch (err: any) {
      return (
        "Error deleting design: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold text-yellow-600 mb-6 text-right lg:text-left ml-16 lg:ml-0">Designs</h1>

      {loading ? (
        <p className="text-gray-500">Loading designs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {designs.map((design) => (
            <div
              key={design._id}
              className="bg-white p-6 rounded-xl shadow-md border border-yellow-100"
            >
              {design.imageUrl?.length > 0 && (
                <img
                  src={design.imageUrl[0]}
                  alt={design.designName}
                  className="w-full h-72 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-lg font-semibold text-gray-800">
                {design.designName}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                Status: {design.status}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                ₱{design.price} | Stock: {design.totalStock}
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => router.push(`/designs/${design._id}/edit`)}
                  className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(design._id)}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Add New Design */}
          <div
            onClick={() => router.push("/designs/upload")}
            className="flex items-center justify-center border-2 border-dashed border-yellow-300 rounded-xl p-6 hover:bg-yellow-50 cursor-pointer"
          >
            <span className="text-yellow-500 font-medium">
              + Add New Design
            </span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  );
}
