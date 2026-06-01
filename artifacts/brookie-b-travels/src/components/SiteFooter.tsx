import { Mail } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const BOOK_EMAIL = "mailto:brookiebtravels@gmail.com";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About" },
  { href: "/#faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: BOOK_EMAIL, label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="bg-white py-16 border-t border-border/70">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-10 items-center">
          <div className="flex justify-center md:justify-start">
            <a href="/" className="font-serif text-3xl leading-none tracking-[-0.04em] text-foreground">
              Brookie B Travels
            </a>
          </div>

          <nav aria-label="Footer menu" className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/75 transition-all hover:bg-foreground/8 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex justify-center md:justify-end space-x-6">
            <a href="#" aria-label="Facebook" className="text-foreground/80 hover:text-foreground transition-colors">
              <FaFacebook className="w-6 h-6" />
            </a>
            <a href="#" aria-label="Instagram" className="text-foreground/80 hover:text-foreground transition-colors">
              <FaInstagram className="w-6 h-6" />
            </a>
            <a
              href={BOOK_EMAIL}
              aria-label="Email Brookie B Travels"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <a href={BOOK_EMAIL} className="text-muted-foreground hover:text-foreground text-sm">
            brookiebtravels@gmail.com
          </a>

          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Copyright © 2026 | Brookie B Travels
          </p>
        </div>
      </div>
    </footer>
  );
}
