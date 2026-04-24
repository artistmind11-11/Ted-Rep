import { motion } from "framer-motion";
import { Link } from "wouter";
import { Quote, ArrowRight } from "lucide-react";
import heroBg from "@images/Website Images/Add_office_items_202604241329.jpeg";
import midBg from "@images/Website Images/Private_jet_interior_202604241329.jpeg";
import ctaBg from "@images/Website Images/Emirates Towers.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: "easeOut" },
  }),
};

const testimonials = [
  {
    quote:
      "It felt like having a senior chief of staff — without the headcount.",
    author: "CEO",
    company: "Fintech Startup",
    location: "Dubai, UAE",
    detail:
      "We were scaling from Series B into Saudi Arabia. The cross-entity complexity and investor communication load was becoming unmanageable. Within two weeks, the coordination was seamless. Three months in, our board processes are sharper than they've ever been.",
  },
  {
    quote:
      "She operates three steps ahead. That's the standard I needed.",
    author: "Managing Director",
    company: "Family Office",
    location: "Riyadh, KSA",
    detail:
      "Managing four board seats across different jurisdictions required someone who understood governance at an institutional level—not just scheduling. The Executive Desk delivered that and more.",
  },
  {
    quote:
      "Confidentiality was non-negotiable for us. We found it here.",
    author: "General Manager",
    company: "Regional MNC",
    location: "Abu Dhabi, UAE",
    detail:
      "As a country head reporting to a global HQ, I needed someone who could hold sensitive strategic information while coordinating across local and international teams. The level of discretion has been exceptional.",
  },
  {
    quote:
      "The GCC context made all the difference. Generic VAs couldn't come close.",
    author: "Investment Manager",
    company: "Private Investment Firm",
    location: "Doha, Qatar",
    detail:
      "The nuance required for board documentation in the GCC—prayer time alignment, regional investor relations norms, QFC compliance standards—is significant. Finding support that already understands this removed months of onboarding friction.",
  },
  {
    quote:
      "Board governance handled with precision I hadn't experienced before.",
    author: "Non-Executive Director",
    company: "Real Estate Development Group",
    location: "Dubai, UAE",
    detail:
      "Serving on three boards simultaneously is demanding. The action tracking, pre-read coordination, and post-meeting documentation quality elevated our entire governance standard. This is what best-in-class looks like.",
  },
];

export default function Testimonials() {
  return (
    <div className="w-full">
      {/* PAGE HERO */}
      <section className="relative py-32 overflow-hidden flex items-center min-h-[60vh]">
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.55] dark:opacity-[0.30]" style={{ backgroundImage: `url('${heroBg}')` }} />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/40 via-background/75 to-background" />
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <span className="text-primary text-xs uppercase tracking-[0.3em] font-medium mb-6 block">
              Client Perspectives
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-medium leading-[1.1] mb-6 text-foreground">
              The Standard We Set.<br />
              <span className="text-muted-foreground font-light italic">
                The Words They Use.
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              From Series B CEOs to family office principals and non-executive directors—what our clients say about working at this level.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* FEATURED TESTIMONIAL */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-[#111111] rounded-sm p-10 md:p-16 text-left relative overflow-hidden"
          >
            <div className="absolute top-8 left-8 text-[#9B8B5F]/20">
              <Quote size={80} />
            </div>
            <div className="relative z-10">
              <p className="text-[#F8F8F6] font-serif text-2xl md:text-3xl font-light italic leading-relaxed mb-10 max-w-3xl">
                "{testimonials[0].quote}"
              </p>
              <div className="w-10 h-0.5 bg-[#9B8B5F] mb-6" />
              <p className="text-[#9B8B5F] text-sm uppercase tracking-[0.2em] font-medium">
                {testimonials[0].author}
              </p>
              <p className="text-[#888888] text-sm mt-1">
                {testimonials[0].company} — {testimonials[0].location}
              </p>
              <p className="text-[#666666] text-sm leading-relaxed mt-6 max-w-xl mx-auto">
                {testimonials[0].detail}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* ALL TESTIMONIALS */}
      <section className="relative py-24 bg-muted/20 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.40] dark:opacity-[0.25]" style={{ backgroundImage: `url('${midBg}')` }} />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/20 via-background/60 to-background/80" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.slice(1).map((t, i) => (
              <motion.div
                key={t.author + t.company}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.3}
                className="bg-card border border-border rounded-sm p-8 hover:border-primary/30 transition-colors relative"
              >
                <Quote size={24} className="text-primary/30 mb-6" />
                <p className="font-serif text-xl text-foreground font-light italic leading-relaxed mb-8">
                  "{t.quote}"
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {t.detail}
                </p>
                <div className="border-t border-border pt-6">
                  <p className="text-primary text-xs uppercase tracking-[0.2em] font-medium">
                    {t.author}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {t.company} — {t.location}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* CONFIDENTIALITY NOTE */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-muted-foreground text-sm leading-relaxed italic">
              Client identities are protected in accordance with our confidentiality protocols. Testimonials are shared with explicit permission and represent the genuine experience of active or former clients.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#111111] relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.30] dark:opacity-[0.25]" style={{ backgroundImage: `url('${ctaBg}')` }} />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#111111]/80 to-[#111111]" />
        <div className="container mx-auto px-6 text-left max-w-2xl relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-[#F8F8F6] mb-6">
              Join This Standard
            </h2>
            <p className="text-[#888888] leading-relaxed mb-10">
              Every engagement begins with a confidential conversation. We respond within one business day.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-[#9B8B5F] text-[#F8F8F6] px-10 py-4 text-sm uppercase tracking-wider hover:bg-[#8A7A4F] transition-colors"
              data-testid="link-testimonials-cta"
            >
              Start a Conversation <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
