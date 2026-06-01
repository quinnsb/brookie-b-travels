import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/SiteFooter";
import { blogPosts, type BlogPost as BlogPostType } from "@/lib/blog";
import { fetchBlogPosts } from "@/lib/blog-api";

const BOOK_EMAIL = "mailto:brookiebtravels@gmail.com";

function setMetaDescription(content: string) {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');

  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.appendChild(meta);
  }

  meta.content = content;
}

export default function BlogPost() {
  const slug = window.location.pathname.split("/").filter(Boolean).at(-1);
  const staticPost = blogPosts.find((blogPost) => blogPost.slug === slug);
  const [adminPost, setAdminPost] = useState<BlogPostType | null>(null);
  const [adminPosts, setAdminPosts] = useState<BlogPostType[]>([]);
  const [isLoadingAdminPost, setIsLoadingAdminPost] = useState(!staticPost);
  const allPosts = [
    ...adminPosts,
    ...blogPosts.filter((blogPost) => !adminPosts.some((adminBlogPost) => adminBlogPost.slug === blogPost.slug)),
  ];
  const post = staticPost || adminPost;
  const relatedPosts = [...allPosts]
    .filter((blogPost) => blogPost.slug !== post?.slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  useEffect(() => {
    fetchBlogPosts()
      .then((posts) => {
        setAdminPosts(posts);
        setAdminPost(posts.find((blogPost) => blogPost.slug === slug) || null);
      })
      .catch(() => {
        setAdminPosts([]);
        setAdminPost(null);
      })
      .finally(() => {
        setIsLoadingAdminPost(false);
      });
  }, [slug]);

  useEffect(() => {
    if (!post) {
      document.title = "Blog Post Not Found | Brookie B Travels";
      setMetaDescription("This Brookie B Travels blog post could not be found.");
      return;
    }

    document.title = `${post.title} | Brookie B Travels`;
    setMetaDescription(post.excerpt);

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      author: {
        "@type": "Person",
        name: post.author,
      },
      publisher: {
        "@type": "Organization",
        name: "Brookie B Travels",
      },
      image: post.featuredImage,
      datePublished: post.date,
      keywords: post.keywords.join(", "),
      mainEntityOfPage: `/blog/${post.slug}`,
    });
    document.head.appendChild(schema);

    return () => {
      schema.remove();
    };
  }, [post]);

  if (isLoadingAdminPost) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <section className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10">
          <p className="text-muted-foreground">Loading post...</p>
        </section>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border/70 bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-6 md:px-10">
            <Link href="/" className="inline-flex items-center text-foreground">
              <span className="font-serif text-2xl leading-none tracking-[-0.04em]">
                Brookie B Travels
              </span>
            </Link>
          </div>
        </header>
        <section className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10">
          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl mb-6">Post not found</h1>
            <p className="text-muted-foreground leading-8 mb-8">
              The blog post you are looking for may have moved or is not published yet.
            </p>
            <Link href="/blog" className="inline-flex items-center uppercase tracking-widest text-xs text-foreground">
              Back to blog <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
        <SiteFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-6 md:px-10">
          <Link href="/" className="inline-flex items-center text-foreground">
            <span className="font-serif text-2xl leading-none tracking-[-0.04em]">
              Brookie B Travels
            </span>
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
            <Link href="/blog" className="rounded-full px-3 py-2 text-foreground/75 transition-all hover:bg-foreground/8 hover:text-foreground">
              Blog
            </Link>
          </nav>

          <Button
            className="uppercase tracking-[0.16em] text-xs h-11 px-6 rounded-full"
            onClick={() => {
              window.location.href = BOOK_EMAIL;
            }}
          >
            Book Travel
          </Button>
        </div>
      </header>

      <article className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground mb-12"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>

          <header className="mb-12">
            <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground mb-5">
              Travel Stories
            </p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[0.98] tracking-[-0.055em] mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <time dateTime={post.date}>{post.displayDate}</time>
              <span aria-hidden="true">•</span>
              <span>{post.author}</span>
              <span aria-hidden="true">•</span>
              <span>{post.readingTime}</span>
            </div>
          </header>

          <p className="text-2xl md:text-3xl font-serif leading-snug text-foreground mb-12">
            {post.excerpt}
          </p>

          <figure className="mb-12">
            <img
              src={post.featuredImage}
              alt={post.featuredImageAlt}
              loading="eager"
              decoding="async"
              className="w-full aspect-[16/9] object-cover shadow-2xl rounded-3xl"
            />
          </figure>

          <div className="prose prose-lg max-w-none prose-p:leading-8 prose-p:text-muted-foreground prose-headings:font-serif prose-headings:tracking-[-0.035em] prose-a:text-foreground">
            {post.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <footer className="mt-16 pt-10 border-t border-border">
            <p className="font-serif text-3xl mb-4">Ready to plan your own story?</p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              If this sounds like the kind of travel energy you want in your corner, send a note and we can start
              building a trip that feels thoughtful, personal, and easy to enjoy.
            </p>
            <Button
              className="uppercase tracking-[0.16em] text-xs h-14 px-10 rounded-full"
              onClick={() => {
                window.location.href = BOOK_EMAIL;
              }}
            >
              Book Travel <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </footer>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-6 pb-20 md:px-10 md:pb-24">
          <div className="mb-8 flex flex-col justify-between gap-4 border-t border-border pt-10 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Keep Reading
              </p>
              <h2 className="font-serif text-4xl md:text-5xl">More from the blog</h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center text-xs uppercase tracking-widest text-foreground hover:text-muted-foreground"
            >
              View all posts <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <article
                key={relatedPost.slug}
                className="overflow-hidden rounded-3xl border border-border/80 bg-white shadow-[0_16px_45px_rgba(40,33,28,0.06)]"
              >
                <Link href={`/blog/${relatedPost.slug}`} className="block h-44 overflow-hidden">
                  <img
                    src={relatedPost.featuredImage}
                    alt={relatedPost.featuredImageAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </Link>

                <div className="p-6">
                  <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
                    <time dateTime={relatedPost.date}>{relatedPost.displayDate}</time>
                    <span aria-hidden="true">•</span>
                    <span>{relatedPost.readingTime}</span>
                  </div>

                  <h3 className="mb-3 font-serif text-2xl leading-tight">
                    <Link href={`/blog/${relatedPost.slug}`} className="hover:text-muted-foreground transition-colors">
                      {relatedPost.title}
                    </Link>
                  </h3>

                  <p className="mb-6 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {relatedPost.excerpt}
                  </p>

                  <Link
                    href={`/blog/${relatedPost.slug}`}
                    className="inline-flex items-center text-xs uppercase tracking-widest text-foreground hover:text-muted-foreground"
                  >
                    Read next <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
