import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function UserPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not authenticated</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your profile</p>
          <Link
            href="/signin"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <p className="text-lg text-gray-900">{session.user.name || "N/A"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-lg text-gray-900">{session.user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Verified
            </label>
            <p className="text-lg text-gray-900">
              {session.user.emailVerified ? "✓ Verified" : "✗ Not Verified"}
            </p>
          </div>

          {session.user.image && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture
              </label>
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-20 h-20 rounded-full"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <p className="text-sm text-gray-500 break-all">{session.user.id}</p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href="/"
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-center"
          >
            Back to Home
          </Link>
          <form action="/signout" method="post" className="flex-1">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-center"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
