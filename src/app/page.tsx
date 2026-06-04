import { db } from "@/db";
import { projects, profile } from "@/db/schema";
import HomePage from "./HomePage";

export default async function Page() {
  // A public portfolio should never hard-crash on a transient DB issue — degrade
  // to the hero with an empty project list instead of throwing a 500. Failures
  // are still logged so real outages stay visible.
  let initialProjects: (typeof projects.$inferSelect)[] = [];
  let userProfile: typeof profile.$inferSelect | undefined;

  try {
    initialProjects = await db.select().from(projects).orderBy(projects.createdAt);
    [userProfile] = await db.select().from(profile).limit(1);
  } catch (error) {
    console.error("[page] Failed to load portfolio data:", error);
  }

  return <HomePage initialProjects={initialProjects} userProfile={userProfile} />;
}
