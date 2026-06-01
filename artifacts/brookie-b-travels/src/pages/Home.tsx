import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/SiteFooter";
import { blogPosts, type BlogPost } from "@/lib/blog";
import { fetchBlogPosts } from "@/lib/blog-api";
import { ArrowRight, Plane, Map, Compass, Instagram } from "lucide-react";

const BOOK_TRAVEL_URL = "https://brookebeneze.inteletravel.com/";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [adminPosts, setAdminPosts] = useState<BlogPost[]>([]);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  useEffect(() => {
    document.title = "Brookie B Travels";
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    fetchBlogPosts()
      .then(setAdminPosts)
      .catch(() => {
        setAdminPosts([]);
      });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const allBlogPosts = [
    ...adminPosts,
    ...blogPosts.filter((post) => !adminPosts.some((adminPost) => adminPost.slug === post.slug)),
  ];
  const latestBlogPosts = [...allBlogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  const instagramImages = [
    { src: "/about-image.jpg", alt: "Brookie B Travels founder by the water" },
    { src: "/valentin-lacoste-C9YxgJoXcWE-unsplash.jpg", alt: "Clear water beach cove" },
    { src: "/sara-canonici-7NzZ0btPVdE-unsplash.jpg", alt: "Colorful cliffside village in Italy" },
    { src: "/faq-image.jpg", alt: "Brookie B Travels founder in a sandstone canyon" },
    { src: "/johannes-kopf-u2s7GQRJELM-unsplash.jpg", alt: "Scenic mountain village by the water" },
    { src: "/lens-by-benji-XjjUrYnjRHQ-unsplash.jpg", alt: "Iconic Italian city landmark" },
  ];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinkClass = (onHero: boolean) =>
    `relative rounded-full px-3 py-2 text-xs font-semibold tracking-[0.16em] uppercase transition-all duration-200 after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100 ${
      onHero
        ? "text-white/85 hover:bg-white/12 hover:text-white after:bg-white"
        : "text-foreground/75 hover:bg-foreground/8 hover:text-foreground after:bg-foreground"
    }`;

  const openBookTravel = () => {
    window.open(BOOK_TRAVEL_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden font-sans bg-background text-foreground">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/90 backdrop-blur-xl border-b border-border/70 py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:px-10">
          <button
            type="button"
            className="flex-shrink-0"
            onClick={() => scrollToSection("home")}
          >
            <span
              className={`font-serif text-lg leading-none tracking-[-0.04em] transition-colors sm:text-xl md:text-2xl ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              Brookie B Travels
            </span>
          </button>
          <div className="hidden md:flex items-center space-x-8">
            <button type="button" onClick={() => scrollToSection("home")} className={navLinkClass(!isScrolled)}>
              Home
            </button>
            <button type="button" onClick={() => scrollToSection("services")} className={navLinkClass(!isScrolled)}>
              Services
            </button>
            <button type="button" onClick={() => scrollToSection("about")} className={navLinkClass(!isScrolled)}>
              About
            </button>
            <button type="button" onClick={() => scrollToSection("faq")} className={navLinkClass(!isScrolled)}>
              FAQ
            </button>
            <button type="button" onClick={() => { window.location.href = "/blog"; }} className={navLinkClass(!isScrolled)}>
              Blog
            </button>
          </div>
          <Button
            variant={isScrolled ? "default" : "secondary"}
            className="h-10 rounded-full px-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] sm:h-11 sm:px-6 sm:text-xs sm:tracking-[0.16em]"
            onClick={openBookTravel}
          >
            Book Travel
          </Button>
        </div>
      </nav>

      <section
        id="home"
        ref={heroRef}
        className="relative flex min-h-[680px] h-[100svh] items-center justify-center overflow-hidden bg-black sm:min-h-[640px]"
      >
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-x-0 -top-[12%] h-[125%] w-full will-change-transform"
          aria-hidden
        >
          <img
            src="/valentin-lacoste-C9YxgJoXcWE-unsplash.jpg"
            alt=""
            fetchPriority="high"
            className="w-full h-full object-cover object-center opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/65" />
        </motion.div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-20 text-center text-white sm:px-6 md:px-10">
          <p className="mb-5 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-white/85 sm:text-xs sm:tracking-[0.34em] md:text-sm">
            Let&apos;s Plan Your Next Adventure
          </p>
          <h1 className="mx-auto mb-6 max-w-5xl font-serif text-4xl leading-[0.98] tracking-[-0.055em] sm:text-5xl md:mb-8 md:text-7xl lg:text-8xl">
            Thoughtful Planning,
            <br className="hidden md:block" /> Unforgettable Travel
          </h1>
          <p className="mx-auto mb-9 max-w-2xl text-sm leading-7 text-white/85 sm:text-base md:mb-12 md:text-xl md:leading-8">
            Elevate your travel with curated itineraries, smart logistics, and experiences that feel truly special. We
            will create unforgettable trips together that leave room for discovery, ease, and connection.
          </p>
          <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-4 sm:max-w-none sm:flex-row">
            <Button
              variant="secondary"
              size="lg"
              className="h-12 w-full justify-center rounded-full bg-white px-8 text-xs uppercase tracking-[0.16em] text-black hover:bg-white/90 sm:h-14 sm:w-[178px] sm:px-10"
              onClick={() => scrollToSection("about")}
            >
              About Me
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 w-full justify-center rounded-full border-white/80 bg-white/5 px-8 text-xs uppercase tracking-[0.16em] text-white backdrop-blur-sm hover:bg-white hover:text-black sm:h-14 sm:w-[178px] sm:px-10"
              onClick={openBookTravel}
            >
              Book Travel <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 sm:py-20 md:py-28 bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-6 lg:gap-12 items-start mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">What I Do</p>
              <h2 className="font-serif text-3xl leading-tight text-foreground mb-5 sm:text-4xl md:text-6xl md:mb-6">
                The planning experience should feel as good as the trip.
              </h2>
            </div>
            <p className="max-w-xl text-muted-foreground text-base leading-7 sm:text-lg sm:leading-8 lg:pt-12">
              I turn the overwhelming parts of travel into a clear, thoughtful plan: where to stay, what to skip, how
              to move around, and how to make the whole trip feel personal instead of copy-pasted.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-6 lg:gap-8">
            <div className="relative min-h-[420px] overflow-hidden rounded-[1.75rem] bg-foreground text-white shadow-[0_24px_80px_rgba(40,33,28,0.14)] sm:min-h-[520px] sm:rounded-[2rem]">
              <img
                src="/douglas-schneiders-8m9iqKsiJfU-unsplash.jpg"
                alt="Paris street scene at golden hour"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/75" />
              <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-8 md:p-10">
                <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/70">Not Just Booked</p>
                <h3 className="font-serif text-3xl leading-tight mb-4 sm:text-4xl md:text-5xl md:mb-5">
                  Designed around the way you actually want to travel.
                </h3>
                <p className="max-w-md leading-7 text-white/80">
                  Less guessing. Less tabs. More intention, better timing, and a trip that feels like it belongs to you.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  icon: Map,
                  title: "Curated travel guides",
                  text:
                    "Iconic destinations are iconic for a reason. I help you experience them well, balancing must-see moments with smarter timing, better neighborhoods, and off-the-radar ideas.",
                },
                {
                  icon: Compass,
                  title: "Thoughtful itineraries",
                  text:
                    "I piece together flights, stays, transfers, meals, tours, and open time so the trip has rhythm. You get structure without feeling scheduled within an inch of your life.",
                },
                {
                  icon: Plane,
                  title: "Smart travel strategy",
                  text:
                    "I help make the tradeoffs clear: where to splurge, where to save, what to book early, and what deserves space for spontaneity.",
                },
              ].map((service) => {
                const Icon = service.icon;

                return (
                  <article
                    key={service.title}
                    className="group grid grid-cols-1 gap-4 rounded-[1.5rem] border border-border/80 bg-white/85 p-5 shadow-[0_14px_45px_rgba(40,33,28,0.055)] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_22px_70px_rgba(40,33,28,0.1)] sm:grid-cols-[auto_1fr] sm:gap-5 sm:rounded-[1.75rem] md:p-7"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/70 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6 stroke-1.5 text-foreground" />
                    </div>
                    <div className="pt-1">
                      <h3 className="font-serif text-2xl mb-3 leading-tight sm:text-3xl">{service.title}</h3>
                      <p className="text-muted-foreground leading-7">{service.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-16 sm:py-20 md:py-28 bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center">
            <div className="relative aspect-[4/5] w-full max-w-sm mx-auto sm:max-w-lg lg:mx-0 lg:aspect-[3/4]">
              <img
                src="/about-image.jpg"
                alt="Brookie B Travels founder sitting in a heart-shaped sculpture by the water"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover shadow-xl rounded-3xl"
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Meet Brooke</p>
              <h2 className="font-serif text-3xl leading-tight mb-6 sm:text-4xl md:text-6xl md:mb-8">Who is Brookie B Travels?</h2>

              <div className="space-y-5 text-muted-foreground leading-7 text-base mb-8 sm:text-lg sm:leading-8 md:mb-10">
                <p>
                  First and foremost, I&apos;m a lifelong lover of travel. I&apos;ve explored over 20 countries (and
                  counting), and I&apos;m always dreaming up the next destination before I&apos;ve even unpacked my
                  bags.
                </p>
                <p>
                  My passion for travel started early — growing up watching Samantha Brown on the Travel Channel and
                  imagining a life spent discovering new places and sharing them with others. I&apos;ve always aspired
                  to be a modern-day version of that: someone who not only inspires people to go, but helps them travel
                  well.
                </p>
                <p>
                  As an independent travel advisor with InteleTravel, I get to turn that passion into something
                  meaningful. Researching destinations, uncovering hidden gems, and thoughtfully piecing together
                  itineraries is where I truly hit my flow state. Time flies, creativity takes over, and it never feels
                  like work — because it&apos;s something I genuinely love doing.
                </p>
                <p>
                  Brookie B Travels is all about going beyond the bucket list. I believe iconic destinations are iconic
                  for a reason, but the magic is in how you experience them. Whether it&apos;s smart timing, curated
                  experiences, or off-the-radar moments, my goal is to help you travel intentionally, confidently, and
                  in a way that feels uniquely you.
                </p>
              </div>

              <Button
                className="h-12 w-full rounded-full bg-primary px-6 text-xs uppercase tracking-[0.16em] text-white hover:bg-primary/90 sm:h-14 sm:w-auto sm:px-10"
                onClick={openBookTravel}
              >
                Book your next vacation with me <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 md:py-28 bg-background">
        <div className="mx-auto mb-10 max-w-3xl px-4 text-center sm:px-6 md:px-10 md:mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Travel Styles</p>
          <h2 className="font-serif text-3xl mb-5 sm:text-4xl md:text-6xl md:mb-6">Trips for every type of traveler</h2>
          <p className="text-muted-foreground text-base leading-7 sm:text-lg sm:leading-8">
            From close-to-home weekends to international trips, once-in-a-lifetime experiences, group travel, and
            cruises — I plan it all. I&apos;m a big believer that neither budget nor time should get in the way of
            booking your trip.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 px-4 sm:grid-cols-2 sm:px-6 md:px-10 lg:grid-cols-4">
          {[
            { src: "/valentin-lacoste-C9YxgJoXcWE-unsplash.jpg", title: "Weekend\nGetaways", alt: "Quiet beach cove for a weekend getaway" },
            { src: "/sara-canonici-7NzZ0btPVdE-unsplash.jpg", title: "International\nTravel", alt: "Cliffside village on the Italian coast" },
            { src: "/johannes-kopf-u2s7GQRJELM-unsplash.jpg", title: "Scenic\nEscapes", alt: "Snowy lakeside village in the mountains" },
            { src: "/lens-by-benji-XjjUrYnjRHQ-unsplash.jpg", title: "Iconic\nCities", alt: "Leaning Tower of Pisa and cathedral" },
          ].map((trip) => (
            <div key={trip.alt} className="group relative">
              <div className="aspect-[5/4] overflow-hidden relative rounded-3xl shadow-[0_18px_55px_rgba(40,33,28,0.12)] sm:aspect-[4/5]">
                <img
                  src={trip.src}
                  alt={trip.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="font-serif text-2xl whitespace-pre-line">{trip.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            variant="outline"
            className="uppercase tracking-[0.16em] text-xs h-14 px-10 rounded-full border-primary text-primary hover:bg-primary hover:text-white"
            onClick={openBookTravel}
          >
            Book Travel <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <section id="faq" className="py-16 sm:py-20 md:py-28 bg-muted/60">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-20 items-center">
            <div className="relative aspect-[4/5] w-full max-w-sm mx-auto sm:max-w-lg lg:mx-0">
              <img
                src="/faq-image.jpg"
                alt="Brookie B Travels founder looking up inside a sandstone canyon"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover shadow-xl rounded-3xl"
              />
            </div>

            <div className="bg-white/80 border border-border/80 rounded-3xl p-5 sm:p-8 md:p-10 shadow-[0_20px_70px_rgba(40,33,28,0.07)]">
              <div className="mb-8 md:mb-12">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Good to Know</p>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl mb-4">Frequently Asked</h2>
                <div className="w-12 h-px bg-foreground/30" />
              </div>

              <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b border-border py-3">
              <AccordionTrigger className="font-serif text-lg sm:text-xl md:text-2xl hover:no-underline text-left">
                How Much Will It Cost To Use Your Services?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-light leading-relaxed text-base">
                Nothing! As an independent travel advisor, I get paid through the booking partners that I use. And
                honestly? It is not even a large percentage. I create itineraries and plan YOUR dream trips because I
                love it!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-border py-3">
              <AccordionTrigger className="font-serif text-lg sm:text-xl md:text-2xl hover:no-underline text-left">
                What Services Do You Offer?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-light leading-relaxed text-base">
                I plan and book a wide range of trips, including weekend getaways, domestic and international travel,
                cruises, group trips, adventure travel, road trips, and once-in-a-lifetime experiences. Whether you
                want full-service planning or help with a specific part of your trip, I&apos;ve got you covered.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-border py-3">
              <AccordionTrigger className="font-serif text-lg sm:text-xl md:text-2xl hover:no-underline text-left">
                Why Should I Use A Travel Advisor Instead Of Planning A Trip Myself?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-light leading-relaxed text-base">
                You get personalized planning, insider knowledge, time savings, and an advocate if something goes wrong.
                I handle the research, logistics, and details so you can focus on enjoying your trip. And thanks to my
                access to the InteleTravel network, even if I haven&apos;t personally traveled to a destination, I can
                rely on thousands of trusted advisors who have — giving you insider, first-hand knowledge every step of
                the way.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-b border-border py-3">
              <AccordionTrigger className="font-serif text-lg sm:text-xl md:text-2xl hover:no-underline text-left">
                Do You Work With All Budgets?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-light leading-relaxed text-base">
                Yes! Thoughtful travel isn&apos;t about how much you spend — it&apos;s about how well your trip is
                planned. I&apos;ve experienced everything from budget stays to 5-star luxury and understand how to
                create incredible trips at many price points. When you work with me, your itinerary is tailored to your
                travel style, comfort level, and budget.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-b border-border py-3">
              <AccordionTrigger className="font-serif text-lg sm:text-xl md:text-2xl hover:no-underline text-left">
                Can You Help If I Already Booked Part Of My Trip?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-light leading-relaxed text-base">
                Absolutely. I can step in to help with accommodations, activities, transportation, or itinerary
                refinement — even if you&apos;ve already booked flights or part of your stay.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border-b border-border py-3 border-b-transparent">
              <AccordionTrigger className="font-serif text-lg sm:text-xl md:text-2xl hover:no-underline text-left">
                What If Something Goes Wrong During My Trip?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-light leading-relaxed text-base">
                You&apos;re not on your own. I act as your point of contact and advocate if issues come up — whether
                it&apos;s a delay, cancellation, or accommodation concern.
              </AccordionContent>
            </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      <section id="blog" className="py-16 sm:py-20 md:py-24 bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10">
          <div className="max-w-3xl mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Travel Stories & Guides
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl mb-5 md:mb-6">Brookie B Travels Blog</h2>
            <p className="text-muted-foreground text-base leading-7 sm:text-lg sm:leading-8">
              Personal travel stories, practical travel planning advice, destination notes, and thoughtful guides for
              travelers who want more than a checklist.
            </p>
            <a
              href="/blog"
              className="mt-6 inline-flex items-center uppercase tracking-widest text-xs text-foreground hover:text-muted-foreground"
            >
              View all posts <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {latestBlogPosts.map((post) => (
              <article
                key={post.slug}
                className="overflow-hidden rounded-3xl border border-border/80 bg-white shadow-[0_16px_45px_rgba(40,33,28,0.06)]"
              >
                <a href={`/blog/${post.slug}`} className="block h-48 overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.featuredImageAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </a>

                <div className="p-6">
                  <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
                    <time dateTime={post.date}>{post.displayDate}</time>
                    <span aria-hidden="true">•</span>
                    <span>{post.readingTime}</span>
                  </div>

                  <h3 className="mb-3 font-serif text-2xl leading-tight">
                    <a href={`/blog/${post.slug}`} className="hover:text-muted-foreground transition-colors">
                      {post.title}
                    </a>
                  </h3>

                  <p className="mb-6 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {post.excerpt}
                  </p>

                  <a
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-xs uppercase tracking-widest text-foreground hover:text-muted-foreground"
                  >
                    Read the story <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24">
        <div className="mx-auto grid w-full max-w-7xl overflow-hidden rounded-[2rem] bg-foreground text-white shadow-[0_24px_90px_rgba(40,33,28,0.16)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[320px] overflow-hidden sm:min-h-[360px] lg:min-h-[520px]">
            <img
              src="/johannes-kopf-u2s7GQRJELM-unsplash.jpg"
              alt="A scenic mountain village by the water"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/75">
                Travel, Made Personal
              </p>
              <p className="max-w-sm font-serif text-2xl leading-tight sm:text-3xl md:text-4xl">
                The best trips feel effortless, but they rarely happen by accident.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8 md:p-12 lg:p-14">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Ready to See the World?
            </p>
            <h2 className="mb-5 font-serif text-3xl leading-tight sm:text-4xl md:text-6xl md:mb-6">
              Let&apos;s turn the trip in your head into a plan you can actually book.
            </h2>
            <p className="mb-8 text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              Send over the destination, the vibe, the budget, or even just the feeling you want from the trip. I&apos;ll
              help shape the details into something thoughtful, beautiful, and easier to say yes to.
            </p>

            <div className="mb-10 grid grid-cols-1 gap-3 text-sm text-white/75 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                <span className="mb-1 block font-serif text-2xl text-white">Vision</span>
                Share the feeling, destination, or dream.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                <span className="mb-1 block font-serif text-2xl text-white">Planning</span>
                Get thoughtful options and clear logistics.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                <span className="mb-1 block font-serif text-2xl text-white">Takeoff</span>
                Travel with support and room to enjoy it.
              </div>
            </div>

            <Button
              className="h-12 w-full rounded-full bg-white px-8 text-xs uppercase tracking-[0.16em] text-primary hover:bg-white/90 sm:h-14 sm:w-fit sm:px-10"
              onClick={openBookTravel}
            >
              Contact us <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-white py-14 sm:py-16 md:py-20">
        <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col justify-between gap-6 px-4 sm:px-6 md:mb-10 md:flex-row md:items-end md:px-10">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Follow Along
            </p>
            <h2 className="font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">Travel notes from Instagram</h2>
          </div>
          <a
            href="https://www.instagram.com/brookiebtravels/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-all hover:bg-foreground hover:text-white"
          >
            <Instagram className="h-4 w-4" />
            @brookiebtravels
          </a>
        </div>

        <div className="instagram-marquee">
          <div className="instagram-marquee-track">
            {[...instagramImages, ...instagramImages].map((image, index) => (
              <a
                key={`${image.src}-${index}`}
                href="https://www.instagram.com/brookiebtravels/"
                target="_blank"
                rel="noreferrer"
                className="group block w-[220px] shrink-0 overflow-hidden rounded-3xl md:w-[280px]"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
