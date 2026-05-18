
import 'dotenv/config';
import { db } from './src/db';
import { projects, profile } from './src/db/schema';
async function main() {
  console.log('QUERY_START');
  const p = await db.select().from(projects);
  console.log('PROJECTS_RESULT', p.length);
  const pr = await db.select().from(profile);
  console.log('PROFILE_RESULT', pr.length);
}
main().catch(err => console.error('FATAL', err));
