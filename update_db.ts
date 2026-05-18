
import { db } from './src/db';
import { profile } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function update() {
  await db.update(profile).set({ name: "Treshnanda" });
  console.log('Database name updated to Treshnanda');
  process.exit(0);
}

update().catch(console.error);
