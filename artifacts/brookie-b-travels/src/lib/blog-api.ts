import type { BlogPost } from "@/lib/blog";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? "" : "http://localhost:5174");
const BLOG_AUTH_STORAGE_KEY = "brookie-b-travels-blog-admin-token";

async function getErrorMessage(response: Response, fallback: string) {
  const text = await response.text();

  try {
    const data = JSON.parse(text) as { error?: string };
    return data.error || fallback;
  } catch {
    return text || fallback;
  }
}

export function getBlogAdminToken() {
  return window.localStorage.getItem(BLOG_AUTH_STORAGE_KEY) || "";
}

export function clearBlogAdminToken() {
  window.localStorage.removeItem(BLOG_AUTH_STORAGE_KEY);
}

function createAuthToken(username: string, password: string) {
  return window.btoa(`${username}:${password}`);
}

export async function fetchBlogPosts() {
  const response = await fetch(`${API_BASE_URL}/api/blog-posts`);

  if (!response.ok) {
    throw new Error("Unable to load blog posts.");
  }

  const data = (await response.json()) as { posts?: BlogPost[] };
  return data.posts || [];
}

export async function loginBlogAdmin(username: string, password: string) {
  const token = createAuthToken(username, password);
  const response = await fetch(`${API_BASE_URL}/api/blog-login`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Invalid blog admin username or password."));
  }

  window.localStorage.setItem(BLOG_AUTH_STORAGE_KEY, token);
  return token;
}

export async function createBlogPost(post: BlogPost & { imageBase64?: string }, authToken: string) {
  const response = await fetch(`${API_BASE_URL}/api/blog-posts`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Unable to create blog post."));
  }

  const data = (await response.json()) as { post: BlogPost };
  return data.post;
}
