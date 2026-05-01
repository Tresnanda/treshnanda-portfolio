"use server";

import { db } from "@/db";
import { projects, profile } from "@/db/schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

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

export async function addProject(data: any) {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");
  
  await db.insert(projects).values({
    title: data.title,
    description: data.description,
    category: data.category,
    link: data.link,
    imageUrl: data.imageUrl,
    tags: data.tags ? data.tags.split(",").map((s: string) => s.trim()) : [],
  });
  
  redirect("/admin/dashboard");
}

export async function updateProfile(data: any) {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");

  const existing = await db.select().from(profile).limit(1);
  if (existing.length > 0) {
    await db.update(profile).set(data).where(eq(profile.id, existing[0].id));
  } else {
    await db.insert(profile).values(data);
  }
  
  redirect("/admin/dashboard");
}

export async function deleteProject(id: number) {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");
  await db.delete(projects).where(eq(projects.id, id));
  redirect("/admin/dashboard");
}
