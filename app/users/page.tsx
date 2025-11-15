"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../lib/state/store";
import { User, removeUser, fetchUsers } from "../../lib/state/slices/userAction";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const users = useSelector((state: RootState) => state.user.value);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        // Use Redux fetchUsers instead of direct fetch (includes proper proxy route)
        await dispatch(fetchUsers()).unwrap();
      } catch (err: any) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [dispatch]);

  const handleDelete = (userId: string) => {
    dispatch(removeUser(userId));
    setDeleteConfirm(null);
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const formatRole = (role: string) =>
    role.charAt(0).toUpperCase() + role.slice(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mb-4 mx-auto"></div>
          <p className="text-gray-600 text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-30">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent text-right lg:text-left ml-16 lg:ml-0">
                Users Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Total: {filteredUsers.length}{" "}
                {filteredUsers.length === 1 ? "user" : "users"}
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
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
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {filteredUsers.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 sm:p-12 text-center">
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No users found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Card Header with Role Badge */}
                <div className="relative h-24 bg-gradient-to-r from-yellow-400 to-orange-400">
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${
                      user.role === "admin"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {user.role === "admin" ? "Admin" : "User"}
                  </span>
                </div>

                {/* Card Content */}
                <div className="pt-14 px-6 pb-6 text-center">
                  <h2 className="font-bold text-lg text-gray-800 mb-1 truncate">
                    {user.fullName}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3 truncate">
                    {user.email}
                  </p>

                  {/* User Info */}
                  <div className="bg-yellow-50 rounded-xl p-3 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Joined</span>
                      <span className="font-medium text-gray-700">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "N/A"}
                      </span>
                    </div>
                    {user.isVerified !== undefined && (
                      <div className="flex items-center justify-between text-xs mt-2">
                        <span className="text-gray-600">Status</span>
                        <span
                          className={`font-medium ${
                            user.isVerified ? "text-green-600" : "text-gray-600"
                          }`}
                        >
                          {user.isVerified ? "✓ Verified" : "Unverified"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/users/${user.id}/edit`)}
                      className="flex-1 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all flex items-center justify-center gap-1"
                    >
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(user.id)}
                      className="flex-1 py-2 bg-red-500 text-white rounded-lg font-medium text-sm hover:bg-red-600 transition-all flex items-center justify-center gap-1"
                    >
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Delete User?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
