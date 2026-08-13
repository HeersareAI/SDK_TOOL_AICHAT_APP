import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: boolean("emailVerified"),
  image: text("image"),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId"),
  providerId: text("providerId"),
  userId: text("userId").references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  expiresAt: timestamp("expiresAt"),
  password: text("password"),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt"),
  token: text("token").unique(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").references(() => user.id, { onDelete: "cascade" }),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier"),
  value: text("value"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});
