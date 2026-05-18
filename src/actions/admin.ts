"use server";

import { db } from "@/db";
import { projects, profile, settings } from "@/db/schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "nanda_secure_pass";

export async function login(password: string) {
  if (password === ADMIN_PASSWORD) {
    (await cookies()).set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return { success: true };
  }
  return { success: false, error: "Invalid password" };
}

export async function logout() {
  (await cookies()).delete("admin_session");
  redirect("/");
}

export async function isAuthenticated() {
  const session = (await cookies()).get("admin_session");
  return session?.value === "authenticated";
}

// --- Project Actions ---

export async function addProject(formData: FormData) {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");
  
  const data: any = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    content: formData.get("content") as string,
    link: formData.get("link") as string,
    github: formData.get("github") as string,
    imageUrl: formData.get("imageUrl") as string,
    images: JSON.parse(formData.get("images") as string || "[]"),
    tags: (formData.get("tags") as string)?.split(",").map(s => s.trim()).filter(Boolean) || [],
    isFeatured: formData.get("isFeatured") === "on",
    status: (formData.get("status") as string) || "live",
  };

  await db.insert(projects).values(data);
  
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function updateProject(id: number, formData: FormData) {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");

  const data: any = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    content: formData.get("content") as string,
    link: formData.get("link") as string,
    github: formData.get("github") as string,
    imageUrl: formData.get("imageUrl") as string,
    images: JSON.parse(formData.get("images") as string || "[]"),
    tags: (formData.get("tags") as string)?.split(",").map(s => s.trim()).filter(Boolean) || [],
    isFeatured: formData.get("isFeatured") === "on",
    status: (formData.get("status") as string) || "live",
    updatedAt: new Date(),
  };

  await db.update(projects).set(data).where(eq(projects.id, id));
  
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function deleteProject(id: number) {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

// --- Profile Actions ---

export async function updateProfile(formData: FormData) {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");

  const existing = await db.select().from(profile).limit(1);
  const current = existing[0] || {};

  const data: any = {
    name: (formData.get("name") as string) || current.name || "",
    role: (formData.get("role") as string) || current.role || "",
    bio: (formData.get("bio") as string) || current.bio || "AI Engineer based in Bali.",
    avatarUrl: (formData.get("avatarUrl") as string) || current.avatarUrl,
    heroHeadline: (formData.get("heroHeadline") as string) || current.heroHeadline,
    heroSubheadline: (formData.get("heroSubheadline") as string) || current.heroSubheadline,
    contactEmail: (formData.get("contactEmail") as string) || current.contactEmail,
    location: (formData.get("location") as string) || current.location,
    resumeUrl: (formData.get("resumeUrl") as string) || current.resumeUrl,
    socials: {
        github: (formData.get("social_github") as string) || current.socials?.github || "",
        linkedin: (formData.get("social_linkedin") as string) || current.socials?.linkedin || "",
        twitter: (formData.get("social_twitter") as string) || current.socials?.twitter || "",
        whatsapp: (formData.get("social_whatsapp") as string) || current.socials?.whatsapp || "",
    },
    updatedAt: new Date(),
  };

  if (existing.length > 0) {
    await db.update(profile).set(data).where(eq(profile.id, existing[0].id));
  } else {
    await db.insert(profile).values(data);
  }
  
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}
