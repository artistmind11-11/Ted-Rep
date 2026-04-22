import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight,
  ShieldCheck,
  Globe,
  Briefcase,
  Users,
  Building2,
  Crown,
  Compass,
  Lock,
  GitBranch,
  Quote,
  Sparkles,
  Mail,
} from "lucide-react";

export default function Home() {
  return (
    <div className="w-full">
      {/* HERO — Centered vertical narrative */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-[0.06] dark:opacity-[0.12]" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/30 via-background/85 to-background" />

        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl pt-20">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-primary text-[11px] uppercase tracking-[0.22em] font-medium mb-8"
          >
            <span className="w-6 h-px bg-primary/60" />
            Absolute Discretion · Uncompromising Standard
            <span className="w-6 h-px bg-primary/60" />
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-[5.25rem] font-serif font-light leading-[1.05] mb-8 text-foreground"
          >
            The Anchor for the
            <br />
            <span className="font-italic text-gold-gradient">Visionary Executive</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-[1.7]"
          >
            Bespoke chief-of-staff coordination, board-level governance, and strategic
            continuity for the GCC's most demanding leaders.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link
              href="/contact"
              className="btn-gold-shimmer bg-primary text-primary-foreground px-8 py-3.5 text-[12px] uppercase tracking-[0.2em] rounded-[2px] hover:bg-primary/90 transition-all font-medium w-full sm:w-auto"
            >
              Request a Consultation
            </Link>
            <Link
              href="/services"
              className="text-foreground border-b border-foreground/60 pb-1 text-[12px] uppercase tracking-[0.2em] hover:text-primary hover:border-primary transition-colors w-full sm:w-auto inline-flex items-center justify-center gap-2"
            >
              Explore Expertise <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 flex flex-col items-center gap-2"
          >
            <span>Scroll</span>
            <span className="w-px h-8 bg-gradient-to-b from-primary/60 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* CREDIBILITY BAR — jurisdiction & trust */}
      <section className="py-12 border-y border-border/60 bg-surface/60">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <span className="text-primary/80 font-medium">Aligned With</span>
            {[
              "DIFC",
              "ADGM",
              "DFSA",
              "SAMA",
              "QFC",
              "MOJ KSA",
            ].map((badge) => (
              <span
                key={badge}
                className="font-display font-light text-foreground/70 hover:text-primary transition-colors"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERS WE COUNSEL */}
      <section className="py-28">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <span className="text-[11px] uppercase tracking-[0.22em] text-primary mb-4 inline-block">
              Clientele
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-light mb-5">
              Leaders We <span className="font-italic text-gold-gradient">Counsel</span>
            </h2>
            <p className="text-muted-foreground leading-[1.7]">
              Operating in the highest echelons of regional business — for principals
              whose schedules cannot tolerate friction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { Icon: Crown,    title: "CEOs & Founders",          desc: "Strategic offloading and executive momentum." },
              { Icon: Building2,title: "Family Office Principals", desc: "Cross-border lifestyle and asset coordination." },
              { Icon: Briefcase,title: "MNC Executives",           desc: "Regional integration and stakeholder alignment." },
              { Icon: Users,    title: "Board Members",            desc: "Impeccable governance and dossier preparation." },
            ].map(({ Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                className="card-lift group p-8 border border-border bg-card rounded-[3px] shadow-silk hover:shadow-silk-lg hover:border-primary/40"
              >
                <div className="w-11 h-11 border border-primary/30 bg-primary/5 text-primary rounded-[3px] flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl mb-3">{title}</h3>
                <p className="text-muted-foreground text-sm leading-[1.7]">{desc}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-primary/70 group-hover:text-primary transition-colors">
                  Bespoke Engagement <ArrowRight size={11} />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS — 3-step horizontal flow */}
      <section className="py-28 bg-surface/60 border-y border-border/60 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <span className="text-[11px] uppercase tracking-[0.22em] text-primary mb-4 inline-block">
              Engagement Process
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-light mb-5">
              Three Movements,{" "}
              <span className="font-italic text-gold-gradient">One Standard</span>
            </h2>
            <p className="text-muted-foreground leading-[1.7]">
              A deliberate cadence — measured, secure, and invisible to the outside world.
            </p>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative">
              {[
                { step: "01", Icon: Compass,   title: "Engage",    desc: "A confidential briefing under NDA. We map friction points, governance gaps, and the texture of your daily orbit." },
                { step: "02", Icon: Lock,      title: "Integrate", desc: "Encrypted channels, isolated data silos, and protocol calibration. Our presence remains entirely invisible externally." },
                { step: "03", Icon: GitBranch, title: "Execute",   desc: "Ongoing counsel and proactive coordination, freeing your bandwidth for the decisions only you can make." },
              ].map(({ step, Icon, title, desc }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.15, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                  className="text-center relative"
                >
                  <div className="w-24 h-24 mx-auto mb-7 bg-card border border-border rounded-full flex items-center justify-center shadow-silk relative">
                    <Icon size={26} strokeWidth={1.4} className="text-primary" />
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-display font-medium tracking-wider px-2 py-0.5 rounded-[2px]">
                      {step}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl mb-3">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-[1.7] max-w-xs mx-auto">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY — Asymmetric editorial */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
              className="lg:col-span-5"
            >
              <span className="text-[11px] uppercase tracking-[0.22em] text-primary mb-4 inline-block">
                Philosophy
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-light mb-7 leading-[1.1]">
                The Architecture
                <br />
                of <span className="font-italic text-gold-gradient">Partnership</span>
              </h2>
              <p className="text-muted-foreground leading-[1.7] mb-6">
                We do not replace your team — we elevate your operational baseline. Our integration is deliberate, secure, and invisible to the outside world.
              </p>
              <p className="text-muted-foreground leading-[1.7] mb-10">
                Every engagement is constructed around the principal's particular tempo. There are no templates here, only craft.
              </p>
              <Link
                href="/about"
                className="text-[12px] uppercase tracking-[0.2em] text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2 border-b border-primary/40 hover:border-primary pb-1"
              >
                Meet the Architect <ArrowRight size={14} />
              </Link>
            </motion.div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
              {[
                { value: "12+",  label: "Years of Counsel" },
                { value: "100%", label: "Client Retention" },
                { value: "3",    label: "GCC Jurisdictions" },
                { value: "0",    label: "Public Disclosures" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.08, duration: 0.55 }}
                  className="card-lift p-8 bg-card border border-border rounded-[3px] shadow-silk hover:shadow-silk-lg hover:border-primary/40"
                >
                  <div className="text-5xl md:text-6xl font-serif font-light text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — Editorial quote cards */}
      <section className="py-28 bg-surface/60 border-y border-border/60">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[11px] uppercase tracking-[0.22em] text-primary mb-4 inline-block">
              Counsel Received
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-light mb-5">
              In Their Own <span className="font-italic text-gold-gradient">Words</span>
            </h2>
            <p className="text-muted-foreground leading-[1.7]">
              Anonymised by design — at the principal's request.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "They restructured the orbit around our chairman so quietly that even our board didn't notice the seam — only that everything began to move with greater precision.",
                attr: "Group COO",
                role: "GCC Conglomerate",
              },
              {
                quote:
                  "The single most leveraged retainer in our family office. Discretion is genuine, judgement is mature, and execution is invariably ahead of the calendar.",
                attr: "Principal",
                role: "Saudi Family Office",
              },
              {
                quote:
                  "I have engaged consultants in London, New York and Singapore. None operate at the regional fluency and personal cadence the Desk delivers.",
                attr: "Founder & CEO",
                role: "DIFC-Regulated Fund",
              },
            ].map((t, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                className="card-lift bg-card border border-border rounded-[3px] p-8 shadow-silk hover:shadow-silk-lg hover:border-primary/40 flex flex-col"
              >
                <Quote size={22} className="text-primary/60 mb-5" strokeWidth={1.5} />
                <blockquote className="text-foreground/90 font-serif text-[1.05rem] leading-[1.7] mb-7 flex-1 italic">
                  "{t.quote}"
                </blockquote>
                <figcaption className="border-t border-border pt-4">
                  <div className="text-sm font-medium text-foreground">{t.attr}</div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mt-0.5">
                    {t.role}
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/testimonials"
              className="text-[12px] uppercase tracking-[0.2em] text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2 border-b border-primary/40 hover:border-primary pb-1"
            >
              Read Full Counsel <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* GCC FOCUS */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-[0.04] dark:opacity-[0.08]" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
          <Globe className="w-11 h-11 mx-auto text-primary mb-7" strokeWidth={1.3} />
          <span className="text-[11px] uppercase tracking-[0.22em] text-primary mb-4 inline-block">
            Regional Mastery
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light mb-7 leading-[1.1]">
            Built Specifically for the{" "}
            <span className="font-italic text-gold-gradient">GCC Landscape</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-14 leading-[1.7]">
            We understand the nuanced protocols of doing business in the region. From navigating KSA MISA regulations to managing complex UAE free-zone entities and aligning schedules with regional rhythms.
          </p>

          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            {["Dubai (DIFC/ADGM)", "Riyadh", "Doha"].map((city) => (
              <span key={city} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT TEASER + CTA */}
      <section className="py-28 bg-[#141413] text-[#F0EDE8] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <Sparkles size={26} className="text-primary mb-6" strokeWidth={1.3} />
              <span className="text-[11px] uppercase tracking-[0.22em] text-primary mb-4 inline-block">
                Begin
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 leading-[1.1] text-[#F0EDE8]">
                Ready for a higher
                <br />
                <span className="font-italic text-gold-gradient">standard?</span>
              </h2>
              <p className="text-[#A8A49C] mb-10 text-lg leading-[1.7] max-w-md">
                Your time is your most precious asset. Let us protect it. Engagements begin with a confidential conversation under NDA.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="btn-gold-shimmer bg-primary text-primary-foreground px-8 py-3.5 text-[12px] uppercase tracking-[0.2em] rounded-[2px] hover:bg-primary/90 transition-colors font-medium inline-flex items-center justify-center gap-2"
                >
                  Initiate Contact <ArrowRight size={14} />
                </Link>
                <a
                  href="mailto:office@executivedesk.ae"
                  className="text-[#F0EDE8] border border-[#2E2E2A] hover:border-primary/50 hover:text-primary transition-colors px-7 py-3.5 text-[12px] uppercase tracking-[0.2em] rounded-[2px] inline-flex items-center justify-center gap-2"
                >
                  <Mail size={14} /> office@executivedesk.ae
                </a>
              </div>
            </div>

            <div className="bg-[#1C1C1A] border border-[#2E2E2A] rounded-[3px] p-8 md:p-10 shadow-silk-lg">
              <div className="flex items-center gap-3 mb-8 pb-5 border-b border-[#2E2E2A]">
                <ShieldCheck size={20} className="text-primary" strokeWidth={1.4} />
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#A8A49C]">
                  Secured Briefing Channel
                </span>
              </div>
              <ul className="space-y-5">
                {[
                  { k: "Response", v: "Within 12 hours" },
                  { k: "Discretion", v: "NDA executed pre-conversation" },
                  { k: "Scope", v: "Single principal engagements only" },
                  { k: "Locations", v: "Dubai · Riyadh · Doha — in-person" },
                ].map(({ k, v }, i) => (
                  <li
                    key={i}
                    className="flex items-baseline justify-between gap-6 text-sm"
                  >
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[#8A8680]">
                      {k}
                    </span>
                    <span className="text-[#F0EDE8] font-light text-right">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
