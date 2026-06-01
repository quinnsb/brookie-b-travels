import { timingSafeEqual } from "node:crypto";

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  displayDate: string;
  author: string;
  excerpt: string;
  featuredImage: string;
  featuredImageAlt: string;
  readingTime: string;
  keywords: string[];
  paragraphs: string[];
};

export type BlogPostInput = Omit<BlogPost, "featuredImage"> & {
  featuredImage?: string;
  imageBase64?: string;
};

type VercelRequestLike = {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
};

type VercelResponseLike = {
  status: (statusCode: number) => VercelResponseLike;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

type GitHubFile = {
  content: string;
  sha: string;
};

const isProduction = process.env["NODE_ENV"] === "production";
const adminUsername = process.env["BLOG_ADMIN_USERNAME"] || (isProduction ? "" : "brooke");
const adminPassword = process.env["BLOG_ADMIN_PASSWORD"] || (isProduction ? "" : "travel2026");
const githubToken = process.env["BLOG_GITHUB_TOKEN"] || process.env["GITHUB_TOKEN"];
const githubRepo = process.env["GITHUB_REPO"] || "quinnsb/brookie-b-travels";
const githubBranch = process.env["GITHUB_BRANCH"] || "main";
const postsPath = process.env["BLOG_POSTS_PATH"] || "artifacts/brookie-b-travels/data/blog-posts.json";
const uploadsPath = process.env["BLOG_UPLOADS_PATH"] || "artifacts/brookie-b-travels/public/blog-uploads";

function safeCompare(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(valueBuffer, expectedBuffer);
}

export function requireBlogAdmin(req: VercelRequestLike, res: VercelResponseLike) {
  if (!adminUsername || !adminPassword) {
    res.status(503).json({ error: "Blog admin credentials are not configured." });
    return false;
  }

  const authHeader = Array.isArray(req.headers.authorization)
    ? req.headers.authorization[0]
    : req.headers.authorization || "";
  const [scheme, encodedCredentials] = authHeader.split(" ");

  if (scheme !== "Basic" || !encodedCredentials) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Brookie B Travels Blog Admin"');
    res.status(401).json({ error: "Blog admin login required." });
    return false;
  }

  const credentials = Buffer.from(encodedCredentials, "base64").toString("utf8");
  const separatorIndex = credentials.indexOf(":");
  const username = separatorIndex >= 0 ? credentials.slice(0, separatorIndex) : "";
  const password = separatorIndex >= 0 ? credentials.slice(separatorIndex + 1) : "";

  if (!safeCompare(username, adminUsername) || !safeCompare(password, adminPassword)) {
    res.status(401).json({ error: "Invalid blog admin username or password." });
    return false;
  }

  return true;
}

function requireGitHubToken() {
  if (!githubToken) {
    throw new Error("BLOG_GITHUB_TOKEN is required to save blog posts.");
  }
}

async function githubRequest(pathname: string, init: RequestInit = {}) {
  requireGitHubToken();

  const response = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${pathname}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${githubToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.headers || {}),
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `GitHub request failed with status ${response.status}.`);
  }

  return response;
}

async function readGitHubFile(pathname: string): Promise<GitHubFile | null> {
  const response = await githubRequest(`${pathname}?ref=${encodeURIComponent(githubBranch)}`);

  if (!response) {
    return null;
  }

  const data = (await response.json()) as GitHubFile;
  return data;
}

async function writeGitHubFile(pathname: string, content: Buffer | string, message: string, sha?: string) {
  await githubRequest(pathname, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: Buffer.from(content).toString("base64"),
      branch: githubBranch,
      ...(sha ? { sha } : {}),
    }),
  });
}

export async function readPosts(): Promise<BlogPost[]> {
  const file = await readGitHubFile(postsPath);

  if (!file) {
    return [];
  }

  const raw = Buffer.from(file.content, "base64").toString("utf8");
  return JSON.parse(raw) as BlogPost[];
}

async function writePosts(posts: BlogPost[]) {
  const existingFile = await readGitHubFile(postsPath);
  await writeGitHubFile(
    postsPath,
    `${JSON.stringify(posts, null, 2)}\n`,
    "Update Brookie B Travels blog posts",
    existingFile?.sha,
  );
}

export function parseBody(req: VercelRequestLike) {
  if (typeof req.body === "string") {
    return JSON.parse(req.body) as BlogPostInput;
  }

  return req.body as BlogPostInput;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

async function saveImage(input: BlogPostInput, slug: string) {
  if (!input.imageBase64) {
    return input.featuredImage || "";
  }

  const match = input.imageBase64.match(/^data:(image\/(?:png|jpe?g|webp));base64,(.+)$/);

  if (!match) {
    throw new Error("Featured image must be a PNG, JPG, or WEBP data URL.");
  }

  const mime = match[1]!;
  const extension = mime.includes("png") ? "png" : mime.includes("webp") ? "webp" : "jpg";
  const fileName = `${slug}-${Date.now()}.${extension}`;
  const uploadPath = `${uploadsPath}/${fileName}`;
  await writeGitHubFile(
    uploadPath,
    Buffer.from(match[2]!, "base64"),
    `Upload featured image for ${input.title || slug}`,
  );

  return `https://raw.githubusercontent.com/${githubRepo}/${githubBranch}/${uploadPath}`;
}

function normalizePost(input: BlogPostInput, featuredImage: string): BlogPost {
  const title = input.title.trim();
  const slug = slugify(input.slug || title);
  const paragraphs = input.paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean);

  if (!title || !slug || !input.excerpt.trim() || paragraphs.length === 0) {
    throw new Error("Title, excerpt, and at least one paragraph are required.");
  }

  if (!featuredImage) {
    throw new Error("A featured image is required.");
  }

  return {
    slug,
    title,
    date: input.date,
    displayDate: input.displayDate || formatDate(input.date),
    author: input.author.trim() || "Brooke",
    excerpt: input.excerpt.trim(),
    featuredImage,
    featuredImageAlt: input.featuredImageAlt.trim() || `${title} featured image`,
    readingTime: input.readingTime.trim() || "5 min read",
    keywords: input.keywords.map((keyword) => keyword.trim()).filter(Boolean),
    paragraphs,
  };
}

export async function createOrUpdatePost(input: BlogPostInput) {
  const slug = slugify(input.slug || input.title || "");
  const featuredImage = await saveImage(input, slug);
  const post = normalizePost(input, featuredImage);
  const posts = await readPosts();
  const existingIndex = posts.findIndex((existingPost) => existingPost.slug === post.slug);

  if (existingIndex >= 0) {
    posts[existingIndex] = post;
  } else {
    posts.unshift(post);
  }

  await writePosts(posts);
  return { post, statusCode: existingIndex >= 0 ? 200 : 201 };
}

export function handleError(res: VercelResponseLike, error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected blog API error.";
  res.status(500).json({ error: message });
}
