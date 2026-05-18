
import { db } from './src/db';
import { projects, profile } from './src/db/schema';
async function main() {
  try {
    const p = await db.select().from(projects);
    const pr = await db.select().from(profile);
    console.log('PROJECTS_COUNT:', p.length);
    console.log('PROFILE_COUNT:', pr.length);
    if (p.length > 0) console.log('FIRST_PROJECT:', JSON.stringify(p[0]));
    if (pr.length > 0) console.log('PROFILE:', JSON.stringify(pr[0]));
  } catch (e) {
    console.error('DB_ERROR:', e);
  }
}
main();
