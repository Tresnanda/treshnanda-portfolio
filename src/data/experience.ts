export type ExperienceEntry = {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  location?: string;
  summary: string;
  outcomes: string[];
  technologies?: string[];
  href?: string;
  placeholder?: boolean;
};

export type EducationEntry = {
  id: string;
  school: string;
  program: string;
  start: string;
  end: string;
  note: string;
};

export const educationEntries: EducationEntry[] = [
  {
    id: "udayana",
    school: "Udayana University",
    program: "BSc Computer Science",
    start: "2022",
    end: "2026",
    note: "GPA 3.97 / 4.00",
  },
  {
    id: "bangkit",
    school: "Bangkit Academy",
    program: "Machine learning cohort",
    start: "2024",
    end: "2024",
    note: "Distinction / Top 10%",
  },
];

export const experienceEntries: ExperienceEntry[] = [
  {
    id: "kembar-digital",
    company: "Kembar Digital Indonesia",
    role: "AI Systems Engineer",
    start: "2026",
    end: "Now",
    summary:
      "Lead AI engineer across four interconnected systems: a self-hosted LLM agent platform, a multi-tenant agent runtime, a creator-facing messaging gateway, and the AI features inside a B2B web app.",
    outcomes: [
      "Shipped an agent platform with a no-code builder, pgvector knowledge bases, and an OpenAI-compatible streaming API.",
      "Hardened production with per-run Docker sandboxes, an encrypted credential vault, and Postgres RLS isolation.",
    ],
    technologies: ["TypeScript", "LLM agents", "pgvector", "Docker"],
  },
  {
    id: "mentorpowerbi",
    company: "Mentorpowerbi",
    role: "AI Engineer",
    start: "2025",
    end: "2026",
    summary:
      "Built the Mentorpowerbi assistant chatbot: agentic RAG on a PostgreSQL vector store, an Azure-hosted backend API, and an LLM-powered data cleaner for CSV and XLSX files.",
    outcomes: ["Took the assistant from prototype to a hosted product feature."],
    technologies: ["Python", "PostgreSQL", "Azure"],
  },
  {
    id: "bali-kori-tour",
    company: "Bali Kori Tour",
    role: "Machine Learning Engineer",
    start: "2024",
    end: "2024",
    location: "Bali",
    summary:
      "Shipped a custom itinerary-recommendation chatbot: agentic RAG over embedded itineraries in a vector database, served through its own backend API.",
    outcomes: ["Delivered the full pipeline from embeddings to production API in a three-month engagement."],
    technologies: ["Python", "RAG", "Vector search"],
  },
  {
    id: "sic-data-club",
    company: "Student Innovation Centre",
    role: "Data Club Leader",
    start: "2024",
    end: "2024",
    location: "Udayana University",
    summary:
      "Led the data club: ran live sessions on data topics, wrote teaching materials, and mentored members through data-related lessons.",
    outcomes: ["Grew a recurring speaker series and teaching library for club members."],
    technologies: ["Python", "SQL", "Data analysis"],
  },
];
