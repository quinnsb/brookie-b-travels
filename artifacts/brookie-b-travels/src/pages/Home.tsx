import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plane, Map, Compass, Mail } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen w-full font-sans bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => scrollToSection("home")}>
            <div className={`p-2 rounded-sm ${!isScrolled ? "bg-white/90 backdrop-blur-sm" : ""}`}>
              <img src="/brookie-b-logo.png" alt="Brookie B Travels" className="h-8 md:h-10 w-auto" />
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection("home")} className={`text-sm font-medium tracking-wide uppercase transition-colors ${!isScrolled ? "text-white hover:text-white/70" : "text-foreground hover:text-primary/70"}`}>Home</button>
            <button onClick={() => scrollToSection("services")} className={`text-sm font-medium tracking-wide uppercase transition-colors ${!isScrolled ? "text-white hover:text-white/70" : "text-foreground hover:text-primary/70"}`}>Services</button>
            <button onClick={() => scrollToSection("about")} className={`text-sm font-medium tracking-wide uppercase transition-colors ${!isScrolled ? "text-white hover:text-white/70" : "text-foreground hover:text-primary/70"}`}>About</button>
            <button onClick={() => scrollToSection("faq")} className={`text-sm font-medium tracking-wide uppercase transition-colors ${!isScrolled ? "text-white hover:text-white/70" : "text-foreground hover:text-primary/70"}`}>FAQ</button>
          </div>
          <div>
            <Button 
              variant={isScrolled ? "default" : "secondary"}
              className="uppercase tracking-widest text-xs h-10 px-6 rounded-none font-medium"
              onClick={() => window.location.href = "mailto:brookiebtravels@gmail.com"}
            >
              Book Travel
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative h-[100dvh] min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
        <motion.div style={{ y: heroY }} className="absolute inset-0 w-full h-full">
          <img 
            src="/hero-bg.png" 
            alt="Cinematic aerial coastline at dusk" 
            className="w-full h-full object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </motion.div>

        <div className="relative z-10 container mx-auto px-6 text-center text-white mt-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm md:text-base tracking-[0.3em] uppercase mb-6 font-medium text-white/90"
          >
            Let's Plan Your Next Adventure
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight mb-8 max-w-5xl mx-auto"
          >
            Thoughtful Planning,<br className="hidden md:block"/> Unforgettable Travel
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl font-light max-w-2xl mx-auto text-white/90 mb-12 leading-relaxed"
          >
            Elevate your travel with curated itineraries, smart logistics, and experiences that feel truly special. We will create unforgettable trips together that leave room for discovery, ease, and connection.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full sm:w-auto uppercase tracking-widest text-xs h-14 px-10 rounded-none bg-white text-black hover:bg-white/90"
              onClick={() => scrollToSection("about")}
            >
              About Me
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto uppercase tracking-widest text-xs h-14 px-10 rounded-none border-white text-white hover:bg-white hover:text-black bg-transparent"
              onClick={() => window.location.href = "mailto:brookiebtravels@gmail.com"}
            >
              Book Travel <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-background relative z-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">The Experience</h2>
            <div className="w-16 h-[1px] bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col"
            >
              <div className="mb-6 text-secondary">
                <Map className="w-10 h-10 stroke-1 text-primary" />
              </div>
              <h3 className="font-serif text-2xl mb-4">Curated Travel Guides</h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                Iconic destinations are iconic for a reason — they just deserve to be experienced well. I blend must-see highlights with hidden gems, using smart timing, skip-the-line access, and thoughtful planning to minimize crowds and stress, so your trip feels seamless, elevated, and uniquely tailored to you.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col"
            >
              <div className="mb-6 text-secondary">
                <Compass className="w-10 h-10 stroke-1 text-primary" />
              </div>
              <h3 className="font-serif text-2xl mb-4">Thoughtful Itineraries</h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                I approach every itinerary like a puzzle — carefully fitting together flights, accommodations, transfers, and experiences so everything flows effortlessly. From weekend escapes to international adventures, I love the challenge of crafting plans that balance logistics, discovery, and joy at every travel level.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col"
            >
              <div className="mb-6 text-secondary">
                <Plane className="w-10 h-10 stroke-1 text-primary" />
              </div>
              <h3 className="font-serif text-2xl mb-4">Smart Travel Strategy</h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                Planning with me comes at no extra cost, but it makes travel infinitely easier. Simply share where you want to go, your budget, and the experiences you're dreaming of — I'll take care of the rest. I'm here before, during, and after your trip to ensure everything runs smoothly, so all you have to do is enjoy the journey.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-[3/4] w-full max-w-md mx-auto lg:mx-0"
            >
              <div className="absolute inset-0 bg-primary translate-x-4 translate-y-4"></div>
              <img 
                src="/about-image.png" 
                alt="Upscale travel aesthetic" 
                className="relative z-10 w-full h-full object-cover shadow-xl grayscale-[20%]"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h2 className="font-serif text-4xl md:text-5xl mb-8">Who is Brookie B Travels?</h2>
              
              <div className="space-y-6 text-muted-foreground font-light leading-relaxed text-lg mb-10">
                <p>First and foremost, I'm a lifelong lover of travel. I've explored over 20 countries (and counting), and I'm always dreaming up the next destination before I've even unpacked my bags.</p>
                
                <p>My passion for travel started early — growing up watching Samantha Brown on the Travel Channel and imagining a life spent discovering new places and sharing them with others. I've always aspired to be a modern-day version of that: someone who not only inspires people to go, but helps them travel well.</p>
                
                <p>As an independent travel advisor with InteleTravel, I get to turn that passion into something meaningful. Researching destinations, uncovering hidden gems, and thoughtfully piecing together itineraries is where I truly hit my flow state. Time flies, creativity takes over, and it never feels like work — because it's something I genuinely love doing.</p>
                
                <p>Brookie B Travels is all about going beyond the bucket list. I believe iconic destinations are iconic for a reason, but the magic is in how you experience them. Whether it's smart timing, curated experiences, or off-the-radar moments, my goal is to help you travel intentionally, confidently, and in a way that feels uniquely you.</p>
              </div>

              <Button 
                className="uppercase tracking-widest text-xs h-14 px-10 rounded-none bg-primary hover:bg-primary/90 text-white"
                onClick={() => window.location.href = "mailto:brookiebtravels@gmail.com"}
              >
                Book your next vacation with me <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trip Types Section */}
      <section className="py-32 bg-background overflow-hidden">
        <div className="container mx-auto px-6 mb-16 text-center max-w-3xl">
          <h2 className="font-serif text-4xl md:text-5xl mb-6">Trips for every type of traveler</h2>
          <p className="text-muted-foreground text-lg font-light">From close-to-home weekends to international trips, once-in-a-lifetime experiences, group travel, and cruises — I plan it all. I'm a big believer that neither budget nor time should get in the way of booking your trip.</p>
        </div>

        <div className="flex flex-nowrap overflow-x-auto pb-10 px-6 gap-6 hide-scrollbar max-w-[100vw] justify-start md:justify-center">
          <div className="min-w-[280px] w-[280px] group cursor-pointer relative">
            <div className="aspect-[4/5] overflow-hidden relative">
              <img src="/trip-weekend.png" alt="Weekend Getaways" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[10%]" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-serif text-2xl">Weekend<br/>Getaways</h3>
              </div>
            </div>
          </div>
          
          <div className="min-w-[280px] w-[280px] group cursor-pointer relative mt-8 md:mt-12">
            <div className="aspect-[4/5] overflow-hidden relative">
              <img src="/trip-international.png" alt="International Travel" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[10%]" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-serif text-2xl">International<br/>Travel</h3>
              </div>
            </div>
          </div>

          <div className="min-w-[280px] w-[280px] group cursor-pointer relative">
            <div className="aspect-[4/5] overflow-hidden relative">
              <img src="/trip-cruise.png" alt="Cruises" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[10%]" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-serif text-2xl">Luxury<br/>Cruises</h3>
              </div>
            </div>
          </div>

          <div className="min-w-[280px] w-[280px] group cursor-pointer relative mt-8 md:mt-12">
            <div className="aspect-[4/5] overflow-hidden relative">
              <img src="/trip-group.png" alt="Group Travel" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[10%]" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-serif text-2xl">Group<br/>Travel</h3>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <Button 
            variant="outline"
            className="uppercase tracking-widest text-xs h-14 px-10 rounded-none border-primary text-primary hover:bg-primary hover:text-white"
            onClick={() => window.location.href = "mailto:brookiebtravels@gmail.com"}
          >
            Book Travel <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Frequently Asked</h2>
            <div className="w-16 h-[1px] bg-primary mx-auto"></div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b border-border py-2">
              <AccordionTrigger className="font-serif text-xl hover:no-underline text-left">How Much Will It Cost To Use Your Services?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-light leading-relaxed text-base">
                Nothing! As an independent travel advisor, I get paid through the booking partners that I use. And honestly? It is not even a large percentage. I create itineraries and plan YOUR dream trips because I love it!
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border-b border-border py-2">
              <AccordionTrigger className="font-serif text-xl hover:no-underline text-left">What Services Do You Offer?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-light leading-relaxed text-base">
                I plan and book a wide range of trips, including weekend getaways, domestic and international travel, cruises, group trips, adventure travel, road trips, and once-in-a-lifetime experiences. Whether you want full-service planning or help with a specific part of your trip, I've got you covered.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-border py-2">
              <AccordionTrigger className="font-serif text-xl hover:no-underline text-left">Why Should I Use A Travel Advisor Instead Of Planning A Trip Myself?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-light leading-relaxed text-base">
                You get personalized planning, insider knowledge, time savings, and an advocate if something goes wrong. I handle the research, logistics, and details so you can focus on enjoying your trip. And thanks to my access to the InteleTravel network, even if I haven't personally traveled to a destination, I can rely on thousands of trusted advisors who have — giving you insider, first-hand knowledge every step of the way.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-b border-border py-2">
              <AccordionTrigger className="font-serif text-xl hover:no-underline text-left">Do You Work With All Budgets?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-light leading-relaxed text-base">
                Yes! Thoughtful travel isn't about how much you spend — it's about how well your trip is planned. I've experienced everything from budget stays to 5-star luxury and understand how to create incredible trips at many price points. When you work with me, your itinerary is tailored to your travel style, comfort level, and budget.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-b border-border py-2">
              <AccordionTrigger className="font-serif text-xl hover:no-underline text-left">Can You Help If I Already Booked Part Of My Trip?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-light leading-relaxed text-base">
                Absolutely. I can step in to help with accommodations, activities, transportation, or itinerary refinement — even if you've already booked flights or part of your stay.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border-b border-border py-2 border-b-transparent">
              <AccordionTrigger className="font-serif text-xl hover:no-underline text-left">What If Something Goes Wrong During My Trip?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-light leading-relaxed text-base">
                You're not on your own. I act as your point of contact and advocate if issues come up — whether it's a delay, cancellation, or accommodation concern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Blog Teaser */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <h2 className="font-serif text-3xl mb-4">Read My Blog!</h2>
          <p className="text-muted-foreground mb-8">Want to see the world differently? I share tips, guides, and stories to help you travel with intention.</p>
          <Button 
            variant="outline"
            className="uppercase tracking-widest text-xs h-12 px-8 rounded-none border-primary text-primary hover:bg-primary hover:text-white"
            onClick={() => {}}
          >
            Read blog <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-primary text-white text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="font-serif text-4xl md:text-6xl mb-8">Ready to See the World?</h2>
          <p className="font-serif italic text-2xl md:text-3xl text-white/80 mb-12">"Because the best investments aren't things — they're experiences that stay with you forever."</p>
          
          <div className="w-16 h-[1px] bg-white/30 mx-auto mb-12"></div>
          
          <p className="text-lg font-light mb-8">Still have more questions? Send me an email!</p>
          
          <Button 
            className="uppercase tracking-widest text-xs h-14 px-10 rounded-none bg-white text-primary hover:bg-white/90"
            onClick={() => window.location.href = "mailto:brookiebtravels@gmail.com"}
          >
            Contact us <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-16 border-t border-border">
        <div className="container mx-auto px-6 flex flex-col items-center">
          <img src="/brookie-b-logo.png" alt="Brookie B Travels" className="h-12 w-auto mb-8 opacity-80" />
          
          <div className="flex space-x-6 mb-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              <FaFacebook className="w-6 h-6" />
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              <FaInstagram className="w-6 h-6" />
            </a>
            <a href="mailto:brookiebtravels@gmail.com" className="text-foreground hover:text-primary transition-colors">
              <Mail className="w-6 h-6" />
            </a>
          </div>
          
          <a href="mailto:brookiebtravels@gmail.com" className="text-muted-foreground hover:text-primary mb-8 text-sm">
            brookiebtravels@gmail.com
          </a>
          
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Copyright © 2023 | Brookie B Travels
          </p>
        </div>
      </footer>

      {/* Global styles for hide-scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
