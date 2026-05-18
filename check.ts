
import { db } from './src/db';
import { profile } from './src/db/schema';
async function main() {
  const res = await db.select().from(profile);
  console.log('PROFILE_DATA:', JSON.stringify(res));
}
main();
