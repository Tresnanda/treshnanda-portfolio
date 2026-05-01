import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  content: text("content"), // Markdown or long text
  imageUrl: text("image_url"),
  link: text("link"),
  tags: text("tags").array(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  heroHeadline: text("hero_headline"),
  heroSubheadline: text("hero_subheadline"),
  contactEmail: text("contact_email"),
  socials: jsonb("socials").default({}),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").unique().notNull(),
  value: text("value").notNull(),
});
