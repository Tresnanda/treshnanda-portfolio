export type PortfolioProject = {
  id: number;
  title: string;
  description: string;
  category: string;
  content: string | null;
  imageUrl: string | null;
  images: string[] | null;
  link: string | null;
  github: string | null;
  tags: string[] | null;
  isFeatured: boolean | null;
  status: string | null;
  metadata: unknown;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type PortfolioProfile = {
  id?: number;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string | null;
  heroHeadline: string | null;
  heroSubheadline: string | null;
  contactEmail: string | null;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    whatsapp?: string;
  } | null;
  location: string | null;
  resumeUrl: string | null;
};
