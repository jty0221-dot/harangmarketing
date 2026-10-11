import { getNaverBlogPosts } from "../../lib/naver-blog";

export const revalidate = 3600;
export const maxDuration = 60;

export async function GET() {
  const posts = await getNaverBlogPosts();
  return Response.json({ posts, total: posts.length }, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
