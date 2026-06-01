import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { timingSafeEqual } from "node:crypto";
import { Router, type IRouter, type RequestHandler } from "express";

type BlogPost = {
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

type BlogPostInput = Omit<BlogPost, "featuredImage"> & {
  featuredImage?: string;
  imageBase64?: string;
  imageFileName?: string;
};

const router: IRouter = Router();

const dataDir = process.env["BLOG_DATA_DIR"]
  ? path.resolve(process.env["BLOG_DATA_DIR"])
  : path.resolve(process.cwd(), "data");
const uploadsDir = process.env["BLOG_UPLOADS_DIR"]
  ? path.resolve(process.env["BLOG_UPLOADS_DIR"])
  : path.resolve(process.cwd(), "..", "brookie-b-travels", "public", "blog-uploads");
const dataPath = path.join(dataDir, "blog-posts.json");
const isProduction = process.env["NODE_ENV"] === "production";
const adminUsername = process.env["BLOG_ADMIN_USERNAME"] || (isProduction ? "" : "brooke");
const adminPassword = process.env["BLOG_ADMIN_PASSWORD"] || (isProduction ? "" : "travel2026");

function safeCompare(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(valueBuffer, expectedBuffer);
}

const requireBlogAdmin: RequestHandler = (req, res, next) => {
  const authHeader = req.get("authorization") || "";
  const [scheme, encodedCredentials] = authHeader.split(" ");

  if (!adminUsername || !adminPassword) {
    res.status(503).json({ error: "Blog admin credentials are not configured." });
    return;
  }

  if (scheme !== "Basic" || !encodedCredentials) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Brookie B Travels Blog Admin"');
    res.status(401).json({ error: "Blog admin login required." });
    return;
  }

  const credentials = Buffer.from(encodedCredentials, "base64").toString("utf8");
  const separatorIndex = credentials.indexOf(":");
  const username = separatorIndex >= 0 ? credentials.slice(0, separatorIndex) : "";
  const password = separatorIndex >= 0 ? credentials.slice(separatorIndex + 1) : "";

  if (!safeCompare(username, adminUsername) || !safeCompare(password, adminPassword)) {
    res.status(401).json({ error: "Invalid blog admin username or password." });
    return;
  }

  next();
};

function slugify(value: string) {
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

async function readPosts(): Promise<BlogPost[]> {
  try {
    const raw = await readFile(dataPath, "utf8");
    return JSON.parse(raw) as BlogPost[];
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writePosts(posts: BlogPost[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataPath, JSON.stringify(posts, null, 2));
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
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, fileName), Buffer.from(match[2]!, "base64"));
  return `/blog-uploads/${fileName}`;
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

router.get("/blog-posts", async (_req, res, next) => {
  try {
    res.json({ posts: await readPosts() });
  } catch (error) {
    next(error);
  }
});

router.post("/blog-login", requireBlogAdmin, (_req, res) => {
  res.json({ ok: true });
});

router.post("/blog-posts", requireBlogAdmin, async (req, res, next) => {
  try {
    const input = req.body as BlogPostInput;
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
    res.status(existingIndex >= 0 ? 200 : 201).json({ post });
  } catch (error) {
    next(error);
  }
});

export default router;
