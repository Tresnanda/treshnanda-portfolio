
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('No DATABASE_URL found');
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

async function main() {
  try {
    const projectsTable = require('./src/db/schema').projects;
    const profileTable = require('./src/db/schema').profile;
    
    const p = await db.select().from(projectsTable);
    const pr = await db.select().from(profileTable);
    
    console.log(JSON.stringify({
      projects: p,
      profile: pr
    }, null, 2));
  } catch (e) {
    console.error('ERROR', e);
  } finally {
    await client.end();
  }
}

main();
