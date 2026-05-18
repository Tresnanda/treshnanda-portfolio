import { db } from "@/db";
import { projects, profile } from "@/db/schema";
import { isAuthenticated, addProject, updateProfile, deleteProject, logout, updateProject } from "@/actions/admin";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function AdminDashboard() {
  if (!(await isAuthenticated())) {
    redirect("/admin");
  }

  const allProjects = await db.select().from(projects).orderBy(projects.createdAt);
  const [userProfile] = await db.select().from(profile).limit(1);

  return (
    <DashboardClient 
        initialProjects={allProjects} 
        userProfile={userProfile} 
        addProject={addProject}
        updateProject={updateProject}
        updateProfile={updateProfile}
        deleteProject={deleteProject}
        logout={logout}
    />
  );
}
