
import { db } from './src/db';
import { profile, settings } from './src/db/schema';

async function seed() {
  console.log('--- System Seed Initialized ---');
  
  const existingProfile = await db.select().from(profile).limit(1);
  if (existingProfile.length === 0) {
    console.log('Identity Core is empty. Injecting baseline data...');
    await db.insert(profile).values({
      name: "Treshnanda",
      role: "AI SYSTEMS & BUSINESS AUTOMATION ENGINEER",
      bio: "CS Grad (3.97 GPA). Architecting logic that scales with zero friction. Building Force Multipliers.",
      heroHeadline: "I build systems that eliminate manual work.",
      heroSubheadline: "Engineering autonomous intelligence and high-fidelity business systems.",
      contactEmail: "hi@treshnanda.tech",
      socials: {
        github: "https://github.com/Tresnanda",
        linkedin: "https://linkedin.com/in/treshnanda",
        twitter: "",
        whatsapp: ""
      }
    });
    console.log('Identity Core Synced.');
  } else {
    console.log('Identity Core already contains data.');
  }
}

seed().catch(console.error);
