"use client";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-yellow-600 mb-6">Settings</h1>

      {/* Profile Section */}
      <section className="mb-8 bg-white rounded-xl shadow-md p-6 border border-yellow-100">
        <h2 className="text-lg font-semibold text-yellow-700 mb-4">Profile</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              defaultValue="Juan Dela Cruz"
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              defaultValue="juan@example.com"
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Save Profile
          </button>
        </form>
      </section>

      {/* Account Section */}
      <section className="mb-8 bg-white rounded-xl shadow-md p-6 border border-yellow-100">
        <h2 className="text-lg font-semibold text-yellow-700 mb-4">Account</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Change Password
            </label>
            <input
              type="password"
              placeholder="New Password"
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Update Password
          </button>
        </form>
      </section>

      {/* Preferences Section */}
      <section className="bg-white rounded-xl shadow-md p-6 border border-yellow-100">
        <h2 className="text-lg font-semibold text-yellow-700 mb-4">
          Preferences
        </h2>
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="accent-yellow-500" />
            <span className="text-gray-700">Enable Notifications</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="accent-yellow-500" />
            <span className="text-gray-700">Dark Mode</span>
          </label>
        </div>
      </section>
    </div>
  );
}
