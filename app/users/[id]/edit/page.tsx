"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/state/store";
import {
  updateUserAsync,
  fetchUserById,
  User,
} from "@/lib/state/slices/userAction";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const fetchedUser = await dispatch(
          fetchUserById(id as string)
        ).unwrap();
        setUser(fetchedUser);
      } catch (err: any) {
        setError(err.message ?? "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    }
    if (id) loadUser();
  }, [id, dispatch]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      await dispatch(updateUserAsync(user)).unwrap();
      router.push("/users");
    } catch (err: any) {
      setError(err.message ?? "Failed to update user");
    } finally {
      setSaving(false);
    }
  }

  const addAddress = () => {
    if (!user) return;
    setUser({
      ...user,
      addresses: [
        ...user.addresses,
        { street: "", city: "", province: "", zip: "" },
      ],
    });
  };

  const removeAddress = (index: number) => {
    if (!user) return;
    const updated = user.addresses.filter((_, i) => i !== index);
    setUser({ ...user, addresses: updated });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mb-4 mx-auto"></div>
          <p className="text-gray-600 text-lg">Loading user...</p>
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-30">
        <div className="px-6 lg:px-8 xl:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/users")}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent text-right lg:text-left ml-16 lg:ml-0">
                  Edit User
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Update user information
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/users")}
                className="px-6 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-user-form"
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {saving ? (
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
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 lg:px-8 xl:px-12 py-6">
        <form id="edit-user-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-32 h-32 rounded-full border-4 border-yellow-400 object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-500 transition-colors shadow-lg">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-4">
                {user.fullName}
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  Full Name
                </label>
                <input
                  type="text"
                  value={user.fullName}
                  onChange={(e) =>
                    setUser({ ...user, fullName: e.target.value })
                  }
                  className="w-full px-6 py-4 bg-white/80 backdrop-blur border-2 border-gray-200 rounded-2xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all text-gray-800 placeholder-gray-500"
                  placeholder="Enter full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                      className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur border-2 border-gray-200 rounded-2xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all text-gray-800"
                      placeholder="email@example.com"
                    />
                    <svg
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={user.phone ?? ""}
                      onChange={(e) =>
                        setUser({ ...user, phone: e.target.value })
                      }
                      className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur border-2 border-gray-200 rounded-2xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all text-gray-800"
                      placeholder="+63 123 456 7890"
                    />
                    <svg
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    Role
                  </label>
                  <div className="relative">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        setUser({ ...user, role: e.target.value })
                      }
                      className="w-full px-6 py-4 bg-white/80 backdrop-blur border-2 border-gray-200 rounded-2xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all text-gray-800 appearance-none cursor-pointer"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <svg
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    Verification Status
                  </label>
                  <label className="flex items-center px-6 py-4 bg-white/80 backdrop-blur border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-yellow-400 transition-all">
                    <input
                      type="checkbox"
                      checked={user.isVerified}
                      onChange={(e) =>
                        setUser({ ...user, isVerified: e.target.checked })
                      }
                      className="w-5 h-5 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
                    />
                    <span className="ml-3 text-gray-800 font-medium">
                      {user.isVerified ? "✓ Verified" : "Not Verified"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Addresses Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Addresses</h3>
                  <p className="text-sm text-gray-600">
                    {user.addresses.length} saved{" "}
                    {user.addresses.length === 1 ? "address" : "addresses"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={addAddress}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Address
              </button>
            </div>

            {user.addresses.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-3"
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
                </svg>
                <p className="text-gray-600 mb-4">No addresses added yet</p>
                <button
                  type="button"
                  onClick={addAddress}
                  className="text-yellow-600 font-medium hover:text-yellow-700"
                >
                  + Add your first address
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {user.addresses.map((addr, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-white/50 to-white/30 backdrop-blur border-2 border-gray-200 rounded-2xl p-6 relative"
                  >
                    <div className="absolute top-4 right-4">
                      <button
                        type="button"
                        onClick={() => removeAddress(i)}
                        className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-12">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Street Address
                        </label>
                        <input
                          type="text"
                          placeholder="123 Main St"
                          value={addr.street ?? ""}
                          onChange={(e) => {
                            const updated = [...user.addresses];
                            updated[i].street = e.target.value;
                            setUser({ ...user, addresses: updated });
                          }}
                          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          City
                        </label>
                        <input
                          type="text"
                          placeholder="Manila"
                          value={addr.city ?? ""}
                          onChange={(e) => {
                            const updated = [...user.addresses];
                            updated[i].city = e.target.value;
                            setUser({ ...user, addresses: updated });
                          }}
                          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Province
                        </label>
                        <input
                          type="text"
                          placeholder="Metro Manila"
                          value={addr.province ?? ""}
                          onChange={(e) => {
                            const updated = [...user.addresses];
                            updated[i].province = e.target.value;
                            setUser({ ...user, addresses: updated });
                          }}
                          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          placeholder="1000"
                          value={addr.zip ?? ""}
                          onChange={(e) => {
                            const updated = [...user.addresses];
                            updated[i].zip = e.target.value;
                            setUser({ ...user, addresses: updated });
                          }}
                          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all text-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
