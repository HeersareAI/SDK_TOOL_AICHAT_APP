import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user || null;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

export async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
