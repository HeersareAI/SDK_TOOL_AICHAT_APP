import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {session.user.name || "User"}!</span>
              <form action="/signout" method="post">
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">User Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Full Name
              </label>
              <p className="text-lg text-gray-900 font-semibold">
                {session.user.name || "Not set"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>
              <p className="text-lg text-gray-900 font-semibold">{session.user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email Verified
              </label>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    session.user.emailVerified ? "bg-green-500" : "bg-yellow-500"
                  }`}
                ></div>
                <p className="text-lg text-gray-900">
                  {session.user.emailVerified ? "Verified" : "Not Verified"}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                User ID
              </label>
              <p className="text-sm text-gray-500 break-all font-mono">
                {session.user.id}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/chat"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="text-3xl mb-3">💬</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI Chat</h3>
            <p className="text-gray-600">Start a conversation with the assistant</p>
          </Link>
          <Link
            href="/user"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="text-3xl mb-3">👤</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">View Profile</h3>
            <p className="text-gray-600">View and manage your profile information</p>
          </Link>

          <Link
            href="/dashboard/settings"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600">Manage your account settings</p>
          </Link>

          <Link
            href="/dashboard/activity"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Activity</h3>
            <p className="text-gray-600">View your account activity</p>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Account Age</span>
                <span className="font-semibold text-gray-900">
                  {session.user.createdAt
                    ? new Date(session.user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-semibold text-gray-900">
                  {session.user.updatedAt
                    ? new Date(session.user.updatedAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Session Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Session Active</span>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Session Expires</span>
                <span className="font-semibold text-gray-900">
                  {session.session.expiresAt
                    ? new Date(session.session.expiresAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
