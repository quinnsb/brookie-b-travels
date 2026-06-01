import type { BlogPost } from "@/lib/blog";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5174";

export async function fetchBlogPosts() {
  const response = await fetch(`${API_BASE_URL}/api/blog-posts`);

  if (!response.ok) {
    throw new Error("Unable to load blog posts.");
  }

  const data = (await response.json()) as { posts?: BlogPost[] };
  return data.posts || [];
}

export async function createBlogPost(post: BlogPost & { imageBase64?: string }) {
  const response = await fetch(`${API_BASE_URL}/api/blog-posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to create blog post.");
  }

  const data = (await response.json()) as { post: BlogPost };
  return data.post;
}
