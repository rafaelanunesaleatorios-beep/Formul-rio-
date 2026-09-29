import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/** Core user table backing the Manus OAuth flow. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const middlemanRoles = mysqlTable("middleman_roles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description").notNull(),
  color: varchar("color", { length: 32 }).default("green").notNull(),
  active: int("active").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const middlemen = mysqlTable("middlemen", {
  id: int("id").autoincrement().primaryKey(),
  displayName: varchar("displayName", { length: 160 }).notNull(),
  discordId: varchar("discordId", { length: 64 }).notNull(),
  roleName: varchar("roleName", { length: 120 }).notNull(),
  focus: varchar("focus", { length: 160 }),
  availability: varchar("availability", { length: 160 }),
  status: mysqlEnum("status", ["active", "paused"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const applications = mysqlTable("middleman_applications", {
  id: int("id").autoincrement().primaryKey(),
  protocol: varchar("protocol", { length: 32 }).notNull().unique(),
  discordId: varchar("discordId", { length: 64 }).notNull(),
  discordTag: varchar("discordTag", { length: 120 }).notNull(),
  ageRange: varchar("ageRange", { length: 40 }).notNull(),
  timezone: varchar("timezone", { length: 80 }).notNull(),
  experience: text("experience").notNull(),
  availability: text("availability").notNull(),
  motivation: text("motivation").notNull(),
  trust: text("trust").notNull(),
  scenario: text("scenario").notNull(),
  references: text("references"),
  extra: text("extra"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type MiddlemanRole = typeof middlemanRoles.$inferSelect;
export type Middleman = typeof middlemen.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;
