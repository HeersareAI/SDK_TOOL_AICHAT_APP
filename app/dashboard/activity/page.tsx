import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ActivityPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  // Mock activity data
  const activities = [
    {
      id: 1,
      action: "Account Created",
      description: "Your account was created",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      type: "account",
    },
    {
      id: 2,
      action: "Password Changed",
      description: "Your password was changed",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      type: "security",
    },
    {
      id: 3,
      action: "Profile Updated",
      description: "Your profile information was updated",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      type: "profile",
    },
    {
      id: 4,
      action: "Login",
      description: "You logged in from 192.168.1.100",
      timestamp: new Date(),
      type: "login",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "account":
        return "👤";
      case "security":
        return "🔒";
      case "profile":
        return "✏️";
      case "login":
        return "🔑";
      default:
        return "📌";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "account":
        return "bg-blue-50 border-blue-200";
      case "security":
        return "bg-red-50 border-red-200";
      case "profile":
        return "bg-purple-50 border-purple-200";
      case "login":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
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
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Recent Activities</h2>

            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`border-l-4 rounded-lg p-4 ${getActivityColor(activity.type)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{activity.action}</h3>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {activity.timestamp.toLocaleDateString()} at{" "}
                        {activity.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center gap-2">
          <button className="px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition">
            Previous
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            1
          </button>
          <button className="px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition">
            2
          </button>
          <button className="px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition">
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
