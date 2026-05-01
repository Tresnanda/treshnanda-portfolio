import { db } from "@/db";
import { projects, profile } from "@/db/schema";
import HomePage from "./HomePage";

export default async function Page() {
  const initialProjects = await db.select().from(projects).orderBy(projects.createdAt);
  const [userProfile] = await db.select().from(profile).limit(1);

  return <HomePage initialProjects={initialProjects} userProfile={userProfile} />;
}
