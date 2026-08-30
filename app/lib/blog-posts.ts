import fs from "fs";
import path from "path";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  published: boolean;
}

const DATA_PATH = path.join(process.cwd(), "content/blog-posts.json");

export function getAllPosts(): BlogPost[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const posts = JSON.parse(raw) as BlogPost[];
    return posts
      .filter((p) => p.published)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch {
    return [];
  }
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
