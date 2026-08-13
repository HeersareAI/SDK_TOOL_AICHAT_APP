import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Account Settings</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                  <span className="text-gray-700">Receive email notifications</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                  <span className="text-gray-700">Receive promotional emails</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                  <span className="text-gray-700">Receive security alerts</span>
                </label>
              </div>
            </div>

            <hr className="my-6" />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                  <span className="text-gray-700">Show profile to other users</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-gray-700">Allow others to contact me</span>
                </label>
              </div>
            </div>

            <hr className="my-6" />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Delete Account
              </button>
              <p className="text-sm text-gray-600 mt-2">
                This action cannot be undone. Please be certain.
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Save Changes
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
