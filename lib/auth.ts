import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import * as schema from "@/auth-schema";
import { getServerAuthOrigin } from "@/lib/auth-url";

export const auth = betterAuth({
  baseURL: getServerAuthOrigin(),
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET || "change-me",
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github", "google"],
      requireLocalEmailVerified: false,
      allowDifferentEmails: false,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
});
