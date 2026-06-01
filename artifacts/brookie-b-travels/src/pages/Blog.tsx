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
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 md:px-10 md:py-6">
          <Link href="/" className="font-serif text-xl leading-none tracking-[-0.04em] text-foreground sm:text-2xl">
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
            className="h-10 rounded-full px-4 text-[0.65rem] uppercase tracking-[0.14em] sm:h-11 sm:px-6 sm:text-xs sm:tracking-[0.16em]"
            onClick={openBookTravel}
          >
            Book Travel
          </Button>
        </div>
      </header>

      <section className="py-12 sm:py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10">
          <div className="max-w-3xl mb-10 md:mb-14">
            <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground mb-5">
              Travel Stories & Guides
            </p>
            <h1 className="font-serif text-4xl leading-[0.98] tracking-[-0.055em] mb-5 sm:text-5xl md:text-7xl md:mb-6">
              Brookie B Travels Blog
            </h1>
            <p className="text-muted-foreground text-base leading-7 sm:text-lg md:text-xl md:leading-8">
              Personal travel stories, practical planning advice, destination notes, and thoughtful guides for travelers
              who want more than a checklist.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white border border-border/80 rounded-3xl shadow-[0_16px_45px_rgba(40,33,28,0.06)] overflow-hidden"
              >
                <Link href={`/blog/${post.slug}`} className="block h-56 overflow-hidden sm:h-72">
                  <img
                    src={post.featuredImage}
                    alt={post.featuredImageAlt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </Link>

                <div className="p-5 sm:p-7 md:p-8">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-5">
                    <time dateTime={post.date}>{post.displayDate}</time>
                    <span aria-hidden="true">•</span>
                    <span>{post.author}</span>
                    <span aria-hidden="true">•</span>
                    <span>{post.readingTime}</span>
                  </div>

                  <h2 className="font-serif text-2xl mb-4 sm:text-3xl md:text-4xl">
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
