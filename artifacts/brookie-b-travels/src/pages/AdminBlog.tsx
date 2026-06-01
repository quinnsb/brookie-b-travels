import { FormEvent, useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { clearBlogAdminToken, createBlogPost, getBlogAdminToken, loginBlogAdmin } from "@/lib/blog-api";
import type { BlogPost } from "@/lib/blog";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(image.src);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(image.src);
      reject(new Error("Unable to read the featured image."));
    };
    image.src = URL.createObjectURL(file);
  });
}

async function fileToDataUrl(file: File) {
  const image = await loadImage(file);
  const maxDimension = 1600;
  const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.round(image.naturalWidth * scale);
  const height = Math.round(image.naturalHeight * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to process the featured image.");
  }

  context.drawImage(image, 0, 0, width, height);

  return new Promise<string>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Unable to compress the featured image."));
          return;
        }

        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      },
      "image/jpeg",
      0.82,
    );
  });
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function AdminBlog() {
  const [authToken, setAuthToken] = useState("");
  const [loginUsername, setLoginUsername] = useState("brooke");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [author, setAuthor] = useState("Brooke");
  const [excerpt, setExcerpt] = useState("");
  const [keywords, setKeywords] = useState("");
  const [featuredImageAlt, setFeaturedImageAlt] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [createdPost, setCreatedPost] = useState<BlogPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "New Blog Post | Brookie B Travels";
    setAuthToken(getBlogAdminToken());
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoggingIn(true);
    setLoginStatus(null);

    try {
      const token = await loginBlogAdmin(loginUsername, loginPassword);
      setAuthToken(token);
      setLoginPassword("");
    } catch (error) {
      setLoginStatus(error instanceof Error ? error.message : "Unable to log in.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  function handleLogout() {
    clearBlogAdminToken();
    setAuthToken("");
    setStatus(null);
    setCreatedPost(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    setCreatedPost(null);

    try {
      const slug = slugify(title);
      const imageBase64 = imageFile ? await fileToDataUrl(imageFile) : undefined;
      const paragraphs = body
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

      const post = await createBlogPost(
        {
          slug,
          title,
          date,
          displayDate: formatDate(date),
          author,
          excerpt,
          featuredImage: "",
          featuredImageAlt,
          imageBase64,
          readingTime: `${Math.max(3, Math.ceil(body.split(/\s+/).filter(Boolean).length / 200))} min read`,
          keywords: keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean),
          paragraphs,
        },
        authToken,
      );

      setCreatedPost(post);
      setStatus("Blog post saved.");
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes("username or password")) {
        handleLogout();
      }

      setStatus(error instanceof Error ? error.message : "Unable to save blog post.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 md:px-10 md:py-6">
          <Link href="/" className="font-serif text-xl leading-none tracking-[-0.04em] text-foreground sm:text-2xl">
            Brookie B Travels
          </Link>
          <Link
            href="/blog"
            className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/75 transition-all hover:bg-foreground/8 hover:text-foreground"
          >
            View Blog
          </Link>
        </div>
      </header>

      <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16 md:px-10">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground mb-4">
            Admin
          </p>
          <h1 className="font-serif text-4xl leading-tight mb-5 sm:text-5xl md:text-6xl">Add a Blog Post</h1>
          <p className="text-muted-foreground leading-8">
            Log in, draft a post, upload a featured image, and publish it to the blog. Paragraphs are created from blank
            lines in the body field, and images are compressed before upload.
          </p>
        </div>

        {!authToken && (
          <form onSubmit={handleLogin} className="space-y-6 rounded-3xl border border-border/80 bg-white p-5 sm:p-6 md:p-8">
            <div>
              <h2 className="mb-3 font-serif text-3xl">Blog Admin Login</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Enter the blog admin username and password before creating new posts.
              </p>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Username</span>
              <input
                value={loginUsername}
                onChange={(event) => setLoginUsername(event.target.value)}
                required
                autoComplete="username"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Password</span>
              <input
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </label>

            <Button
              type="submit"
              disabled={isLoggingIn}
              className="h-12 rounded-full px-7 text-xs uppercase tracking-[0.16em]"
            >
              {isLoggingIn ? "Logging in..." : "Log in"}
            </Button>

            {loginStatus && <p className="text-sm text-muted-foreground">{loginStatus}</p>}
          </form>
        )}

        {authToken && (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-border/80 bg-white p-5 sm:p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
            <p className="text-sm text-muted-foreground">Logged in as blog admin.</p>
            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              className="h-10 w-fit rounded-full px-5 text-xs uppercase tracking-[0.16em]"
            >
              Log out
            </Button>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </label>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Date</span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Author</span>
              <input
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                required
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">SEO Excerpt</span>
            <textarea
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              required
              rows={3}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Keywords, comma separated</span>
            <input
              value={keywords}
              onChange={(event) => setKeywords(event.target.value)}
              placeholder="travel advisor, vacation planning, Italy itinerary"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </label>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Featured Image</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                required
                onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Image Alt Text</span>
              <input
                value={featuredImageAlt}
                onChange={(event) => setFeaturedImageAlt(event.target.value)}
                required
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Body</span>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              required
              rows={14}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 leading-7 outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </label>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-full px-7 text-xs uppercase tracking-[0.16em]"
          >
            {isSubmitting ? "Saving..." : "Save Blog Post"}
          </Button>

          {status && (
            <p className="text-sm text-muted-foreground">
              {status}{" "}
              {createdPost && (
                <Link href={`/blog/${createdPost.slug}`} className="text-foreground underline">
                  View post
                </Link>
              )}
            </p>
          )}
        </form>
        )}
      </section>
    </main>
  );
}
