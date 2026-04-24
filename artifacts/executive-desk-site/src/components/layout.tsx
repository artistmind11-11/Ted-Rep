import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ModeToggle } from "./mode-toggle";
import { Menu, X, Mail, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoPath from "@assets/No_text_transparent_logo_new.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/blog", label: "Insights" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Header height — logo fills top to bottom border
  const HEADER_H = scrolled ? "h-16" : "h-20";
  const LOGO_H = scrolled ? "h-16 w-16" : "h-20 w-20";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-foreground">
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled
            ? "glass-nav border-border/70 shadow-silk"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className={`container mx-auto pl-0 pr-4 md:pr-8 flex items-center justify-between transition-all duration-300 ${HEADER_H}`}>
          {/* Logo — fills full header height, charcoal-bg badge so transparent dark mark always reads */}
          <Link href="/" className="flex items-center gap-4 z-50 h-full">
            <div className={`${LOGO_H} flex items-center justify-center transition-all duration-300`}>
              <img
                src={logoPath}
                alt="The Executive Desk"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="font-serif font-medium text-lg md:text-xl tracking-wide hidden sm:block">
              The Executive Desk
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] tracking-wide transition-colors hover:text-primary relative py-1 ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
                {location === link.href && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/portal"
              className="btn-gold-shimmer bg-primary text-primary-foreground px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] rounded-[2px] hover:bg-primary/90 transition-colors font-medium"
            >
              Portal Access
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-3 z-50">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 text-foreground"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-28 pb-6 px-6 flex flex-col border-b border-border md:hidden h-screen overflow-y-auto"
          >
            <nav className="flex flex-col gap-6 mt-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={`text-2xl font-serif tracking-wide block ${
                      location === link.href ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 + 0.1 }}
                className="mt-8 pt-8 border-t border-border"
              >
                <Link
                  href="/portal"
                  className="btn-gold-shimmer bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-[0.18em] rounded-[2px] hover:bg-primary/90 transition-colors text-center block w-full font-medium"
                >
                  Portal Access
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="h-full flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Institutional footer */}
      <footer className="bg-[#141413] text-[#F0EDE8] pt-20 pb-10 border-t border-[#2E2E2A] relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            {/* Brand block */}
            <div className="md:col-span-4">
              <Link href="/" className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-black flex items-center justify-center border border-[#2E2E2A]">
                  <img src={logoPath} alt="The Executive Desk Logo" className="w-9 h-9 object-contain" />
                </div>
                <span className="font-serif font-medium text-xl tracking-wide">
                  The Executive Desk
                </span>
              </Link>
              <p className="text-[#8A8680] text-sm leading-[1.7] max-w-sm mb-6">
                Bespoke executive coordination and strategic advisory firm serving senior leaders across the GCC. Absolute discretion, uncompromising standard.
              </p>
              <div className="flex flex-col gap-2 text-xs text-[#8A8680]">
                <span className="flex items-center gap-2"><MapPin size={12} className="text-primary" /> DIFC, Dubai · Riyadh · Doha</span>
                <span className="flex items-center gap-2"><Mail size={12} className="text-primary" /> office@executivedesk.ae</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-display text-[11px] uppercase tracking-[0.2em] mb-5 text-primary/90">Firm</h4>
              <ul className="space-y-3">
                {navLinks.slice(0, 4).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[#A8A49C] hover:text-primary transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-display text-[11px] uppercase tracking-[0.2em] mb-5 text-primary/90">Resources</h4>
              <ul className="space-y-3">
                {navLinks.slice(4).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[#A8A49C] hover:text-primary transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-4">
              <h4 className="font-display text-[11px] uppercase tracking-[0.2em] mb-5 text-primary/90">Confidential Briefing</h4>
              <p className="text-[#8A8680] text-sm leading-relaxed mb-5">
                Receive quarterly counsel on regional governance, family-office structuring, and strategic continuity.
              </p>
              <form className="flex border border-[#2E2E2A] focus-within:border-primary/60 transition-colors rounded-[3px] overflow-hidden">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm text-[#F0EDE8] placeholder:text-[#5A5750] outline-none"
                />
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] hover:bg-primary/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <Link
                href="/portal"
                className="mt-5 inline-block text-[11px] uppercase tracking-[0.2em] text-primary border-b border-primary/40 hover:border-primary pb-0.5 transition-colors"
              >
                Client Portal Access →
              </Link>
            </div>
          </div>

          <div className="border-t border-[#2E2E2A] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-[#5A5750] uppercase tracking-[0.18em]">
            <p>UAE · KSA · Qatar — Operating Confidentially Across the GCC</p>
            <p className="flex items-center gap-6">
              <span>AES-256 · SOC 2 Aligned</span>
              <span>© {new Date().getFullYear()} The Executive Desk</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
