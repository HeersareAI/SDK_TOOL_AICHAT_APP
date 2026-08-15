"use client";

import { createAuthClient } from "better-auth/react";
import { getClientAuthOrigin } from "@/lib/auth-url";

export const authClient = createAuthClient({
  baseURL: getClientAuthOrigin(),
  basePath: "/api/auth",
});

export const { useSession, signIn, signOut, signUp } = authClient;
