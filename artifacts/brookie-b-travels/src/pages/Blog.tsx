import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/SiteFooter";
import { blogPosts, type BlogPost } from "@/lib/blog";
import { fetchBlogPosts } from "@/lib/blog-api";

const BOOK_TRAVEL_URL = "https://brookebeneze.inteletravel.com/";

function setMetaDescription(content: string) {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');

  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.appendChild(meta);
  }

  meta.content = content;
}

export default function Blog() {
  const [adminPosts, setAdminPosts] = useState<BlogPost[]>([]);
  const openBookTravel = () => {
    window.open(BOOK_TRAVEL_URL, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    document.title = "Travel Blog | Brookie B Travels";
    setMetaDescription(
      "Read Brookie B Travels stories, destination notes, travel planning tips, and thoughtful guides for intentional travelers.",
    );

    fetchBlogPosts()
      .then(setAdminPosts)
      .catch(() => {
        setAdminPosts([]);
      });
  }, []);

  const posts = [...adminPosts, ...blogPosts.filter((post) => !adminPosts.some((adminPost) => adminPost.slug === post.slug))];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-6 md:px-10">
          <Link href="/" className="font-serif text-2xl leading-none tracking-[-0.04em] text-foreground">
            Brookie B Travels
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-[0.16em] uppercase">
            <Link href="/" className="rounded-full px-3 py-2 text-foreground/75 transition-all hover:bg-foreground/8 hover:text-foreground">
              Home
            </Link>
            <Link href="/#services" className="rounded-full px-3 py-2 text-foreground/75 transition-all hover:bg-foreground/8 hover:text-foreground">
              Services
            </Link>
            <Link href="/#about" className="rounded-full px-3 py-2 text-foreground/75 transition-all hover:bg-foreground/8 hover:text-foreground">
              About
            </Link>
            <Link href="/#faq" className="rounded-full px-3 py-2 text-foreground/75 transition-all hover:bg-foreground/8 hover:text-foreground">
              FAQ
            </Link>
            <Link href="/blog" className="rounded-full px-3 py-2 bg-foreground/8 text-foreground transition-all hover:bg-foreground/12">
              Blog
            </Link>
          </nav>

          <Button
            className="uppercase tracking-[0.16em] text-xs h-11 px-6 rounded-full"
            onClick={openBookTravel}
          >
            Book Travel
          </Button>
        </div>
      </header>

      <section className="py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="max-w-3xl mb-14">
            <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground mb-5">
              Travel Stories & Guides
            </p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[0.98] tracking-[-0.055em] mb-6">
              Brookie B Travels Blog
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-8">
              Personal travel stories, practical planning advice, destination notes, and thoughtful guides for travelers
              who want more than a checklist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white border border-border/80 rounded-3xl shadow-[0_16px_45px_rgba(40,33,28,0.06)] overflow-hidden"
              >
                <Link href={`/blog/${post.slug}`} className="block h-72 overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.featuredImageAlt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </Link>

                <div className="p-7 md:p-8">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-5">
                    <time dateTime={post.date}>{post.displayDate}</time>
                    <span aria-hidden="true">•</span>
                    <span>{post.author}</span>
                    <span aria-hidden="true">•</span>
                    <span>{post.readingTime}</span>
                  </div>

                  <h2 className="font-serif text-3xl md:text-4xl mb-4">
                    <Link href={`/blog/${post.slug}`} className="hover:text-muted-foreground transition-colors">
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-muted-foreground leading-8 mb-8">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center uppercase tracking-widest text-xs text-foreground hover:text-muted-foreground"
                  >
                    Read the story <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
