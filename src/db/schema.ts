import { pgTable, serial, text, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  content: text("content"), 
  imageUrl: text("image_url"),
  images: jsonb("images").$type<string[]>().default([]),
  link: text("link"),
  github: text("github"),
  tags: text("tags").array(),
  isFeatured: boolean("is_featured").default(false),
  status: text("status").default("live"), // live, archived, draft
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  avatarUrl: text("avatar_url"),
  heroHeadline: text("hero_headline"),
  heroSubheadline: text("hero_subheadline"),
  contactEmail: text("contact_email"),
  socials: jsonb("socials").$type<{ github?: string, linkedin?: string, twitter?: string, whatsapp?: string }>().default({
    github: "",
    linkedin: "",
    twitter: "",
    whatsapp: ""
  }),
  location: text("location").default("Bali, Indonesia"),
  resumeUrl: text("resume_url"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").unique().notNull(),
  value: text("value").notNull(),
  group: text("group").default("general"), // general, seo, technical
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});
