// API Response types
export interface Page {
  id: string;
  title: string;
  slug: string;
  content?: string;
  description: string;
  category: string;
  createdAt: string;
  author: string;
  authorEmail: string;
  tags?: string[];
}

export interface AIResponse {
  response: string;
}

export interface AIRequest {
  prompt: string;
}

// Prisma types (these would be auto-generated, but we'll define them here for now)
export interface PrismaPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  viewCount: number;
  authorName: string;
  authorEmail: string;
  createdAt: Date;
  updatedAt: Date;
  tags: PrismaTag[];
}

export interface PrismaTag {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
} 