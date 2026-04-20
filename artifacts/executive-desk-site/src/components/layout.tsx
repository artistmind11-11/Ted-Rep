import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ModeToggle } from "./mode-toggle";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoPath from "@assets/ED_Logo_1776701058230.png";

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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-foreground">
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-background/80 backdrop-blur-md border-border py-3 shadow-sm"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 z-50">
            <div className="w-10 h-10 rounded-sm overflow-hidden bg-[#1A1A1A] flex items-center justify-center border border-primary/20">
              <img src={logoPath} alt="The Executive Desk" className="w-8 h-8 object-contain mix-blend-screen" />
            </div>
            <span className="font-serif font-semibold text-lg tracking-wide hidden sm:block">
              The Executive Desk
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-colors hover:text-primary relative py-1 ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
                {location === link.href && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            <Link
              href="/portal"
              className="bg-primary text-primary-foreground px-5 py-2 text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors font-medium border border-primary/20"
            >
              Portal Access
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-4 z-50">
            <ModeToggle />
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
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 pb-6 px-6 flex flex-col border-b border-border md:hidden h-screen overflow-y-auto"
          >
            <nav className="flex flex-col gap-6 mt-8">
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
                  className="bg-primary text-primary-foreground px-6 py-3 text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors text-center block w-full font-medium"
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-[#111111] text-[#F8F8F6] pt-16 pb-8 border-t border-[#333333]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-6 inline-flex">
                <div className="w-10 h-10 rounded-sm overflow-hidden bg-black flex items-center justify-center border border-[#333]">
                  <img src={logoPath} alt="The Executive Desk Logo" className="w-8 h-8 object-contain" />
                </div>
                <span className="font-serif font-semibold text-lg tracking-wide">
                  The Executive Desk
                </span>
              </Link>
              <p className="text-[#888888] text-sm leading-relaxed max-w-xs">
                Bespoke executive coordination and strategic advisory firm serving senior leaders across the GCC. Absolute discretion, uncompromising standard.
              </p>
            </div>
            
            <div>
              <h4 className="font-serif text-lg mb-6 text-white tracking-wide">Navigation</h4>
              <ul className="space-y-3">
                {navLinks.slice(0, 4).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[#888888] hover:text-[#9B8B5F] transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg mb-6 text-white tracking-wide">Resources</h4>
              <ul className="space-y-3">
                {navLinks.slice(4).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[#888888] hover:text-[#9B8B5F] transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg mb-6 text-white tracking-wide">Client Access</h4>
              <p className="text-[#888888] text-sm leading-relaxed mb-6">
                Secure access for active clients and firm personnel.
              </p>
              <Link
                href="/portal"
                className="bg-[#9B8B5F] text-[#F8F8F6] px-5 py-2 text-xs uppercase tracking-wider hover:bg-[#8A7A4F] transition-colors inline-block"
              >
                Portal Access
              </Link>
            </div>
          </div>

          <div className="border-t border-[#222222] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#666666]">
            <p>UAE | Saudi Arabia | Qatar</p>
            <p className="flex items-center gap-4">
              <span>Confidentiality Notice</span>
              <span>&copy; {new Date().getFullYear()} The Executive Desk. All rights reserved.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
