CREATE TABLE "profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"bio" text NOT NULL,
	"hero_headline" text,
	"hero_subheadline" text,
	"contact_email" text,
	"socials" jsonb DEFAULT '{"github":"","linkedin":"","twitter":"","whatsapp":""}'::jsonb,
	"location" text DEFAULT 'Bali, Indonesia',
	"resume_url" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"content" text,
	"image_url" text,
	"link" text,
	"github" text,
	"tags" text[],
	"is_featured" boolean DEFAULT false,
	"status" text DEFAULT 'live',
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"group" text DEFAULT 'general',
	"description" text,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "settings_key_unique" UNIQUE("key")
);
