import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Globe, Briefcase } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-10 dark:opacity-20" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-primary text-sm uppercase tracking-[0.3em] font-medium mb-6 block">Absolute Discretion. Uncompromising Standard.</span>
            <h1 className="text-5xl md:text-7xl font-serif font-medium leading-[1.1] mb-8 text-foreground">
              The Anchor for the <br />
              <span className="text-muted-foreground italic font-light">Visionary Executive</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Bespoke chief-of-staff coordination, board-level governance, and strategic continuity for the GCC's most demanding leaders.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/contact"
                className="bg-primary text-primary-foreground px-8 py-4 text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-all font-medium border border-primary/20 w-full sm:w-auto"
              >
                Request a Consultation
              </Link>
              <Link
                href="/services"
                className="text-foreground border-b border-foreground pb-1 text-sm uppercase tracking-wider hover:text-primary hover:border-primary transition-colors w-full sm:w-auto inline-flex items-center justify-center gap-2"
              >
                Explore Expertise <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GOLD DIVIDER */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent my-16" />

      {/* LEADERS WE COUNSEL */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Leaders We Counsel</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Operating in the highest echelons of regional business.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "CEOs & Founders", desc: "Strategic offloading and executive momentum." },
              { title: "Family Office Principals", desc: "Cross-border lifestyle and asset coordination." },
              { title: "MNC Executives", desc: "Regional integration and stakeholder alignment." },
              { title: "Board Members", desc: "Impeccable governance and dossier preparation." }
            ].map((role, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-8 border border-border/50 bg-card rounded-sm text-center hover:border-primary/30 transition-colors group"
              >
                <div className="w-12 h-12 mx-auto border border-primary/20 bg-primary/5 text-primary rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Briefcase size={20} />
                </div>
                <h3 className="font-serif text-xl mb-3">{role.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{role.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-32 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/3">
              <h2 className="text-3xl md:text-5xl font-serif mb-6">The Architecture<br />of Partnership</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We do not replace your team; we elevate your operational baseline. Our integration is deliberate, secure, and invisible to the outside world.
              </p>
              <Link
                href="/about"
                className="text-sm uppercase tracking-wider text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
              >
                Meet the Architect <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="md:w-2/3 grid gap-8">
              {[
                { step: "01", title: "Discovery & NDA", desc: "A confidential briefing to understand your friction points, structural complexity, and specific governance requirements." },
                { step: "02", title: "Secure Integration", desc: "Implementation of isolated communication channels, encrypted data silos, and establishment of operational protocols." },
                { step: "03", title: "Ongoing Counsel", desc: "Proactive management of your strategic priorities, allowing you to focus purely on high-leverage decision making." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start bg-card p-8 rounded-sm border border-border/50 shadow-sm">
                  <span className="text-primary font-serif text-3xl opacity-50">{item.step}</span>
                  <div>
                    <h3 className="font-serif text-xl mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GCC FOCUS */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-5 dark:opacity-10" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <Globe className="w-12 h-12 mx-auto text-primary mb-8" />
          <h2 className="text-3xl md:text-5xl font-serif mb-8 max-w-3xl mx-auto">Built Specifically for the GCC Landscape</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-16 leading-relaxed">
            We understand the nuanced protocols of doing business in the region. From navigating KSA MISA regulations to managing complex UAE free zone entities and aligning schedules with regional rhythms.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Dubai (DIFC/ADGM)</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Riyadh</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Doha</span>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 bg-foreground text-background">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <ShieldCheck className="w-12 h-12 mx-auto text-primary mb-8" />
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-[#F8F8F6]">Ready for a higher standard?</h2>
          <p className="text-[#888888] mb-12 text-lg">Your time is your most precious asset. Let us protect it.</p>
          <Link
            href="/contact"
            className="bg-primary text-primary-foreground px-10 py-5 text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors font-medium border border-primary inline-block"
          >
            Initiate Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
