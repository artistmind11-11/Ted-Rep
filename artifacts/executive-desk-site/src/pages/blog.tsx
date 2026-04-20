import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Calendar } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: "easeOut" },
  }),
};

export const articles = [
  {
    slug: "board-governance-uae",
    title: "Board Governance in the UAE: What Every Director Must Know",
    excerpt:
      "From DIFC-listed entities to family-held conglomerates, UAE board governance has its own rhythm. Understanding the documentation standards, quorum requirements, and cultural protocols that govern board conduct is not optional—it is the baseline.",
    date: "March 2025",
    category: "Governance",
    readTime: "6 min read",
  },
  {
    slug: "multi-entity-management-gcc",
    title: "Managing Across Entities: The GCC Executive's Coordination Challenge",
    excerpt:
      "Operating a holding company in the UAE, a subsidiary in KSA, and a JV in Qatar simultaneously requires more than a shared calendar. Strategic continuity across jurisdictions demands a different kind of operational infrastructure.",
    date: "February 2025",
    category: "Operations",
    readTime: "8 min read",
  },
  {
    slug: "confidentiality-family-offices",
    title: "Confidentiality in Family Offices: The Non-Negotiable Standard",
    excerpt:
      "Family office principals carry a unique burden: the weight of information that cannot be shared, strategies that cannot be disclosed, and relationships that require absolute discretion at every point of contact. Here is what that standard actually demands.",
    date: "January 2025",
    category: "Discretion",
    readTime: "5 min read",
  },
  {
    slug: "executive-productivity-ramadan",
    title: "Executive Productivity During Ramadan: A Framework That Works",
    excerpt:
      "Ramadan reshapes the operational calendar across the GCC in ways that external advisors consistently underestimate. Shortened hours, shifted energy cycles, and heightened relationship protocols require a calibrated approach—not a reduced one.",
    date: "December 2024",
    category: "Culture",
    readTime: "7 min read",
  },
  {
    slug: "ksa-misa-entity-setup",
    title: "Navigating KSA MISA: What the Regional Expansion Looks Like in Practice",
    excerpt:
      "Saudi Arabia's MISA licensing process is more streamlined than it was five years ago—but it still demands precision. Understanding the documentation sequence, regional relationship context, and compliance requirements upfront prevents costly delays.",
    date: "November 2024",
    category: "Regulatory",
    readTime: "9 min read",
  },
  {
    slug: "stakeholder-alignment-hierarchy",
    title: "Stakeholder Alignment in Hierarchical Organizations: The GCC Reality",
    excerpt:
      "In flat organizations, alignment is hard enough. In the hierarchical structures common to GCC family businesses and government-adjacent entities, it requires an entirely different communication architecture—one that respects authority without sacrificing clarity.",
    date: "October 2024",
    category: "Strategy",
    readTime: "6 min read",
  },
];

const categoryColors: Record<string, string> = {
  Governance: "bg-blue-500/10 text-blue-500 dark:text-blue-400",
  Operations: "bg-green-500/10 text-green-500 dark:text-green-400",
  Discretion: "bg-purple-500/10 text-purple-500 dark:text-purple-400",
  Culture: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Regulatory: "bg-red-500/10 text-red-600 dark:text-red-400",
  Strategy: "bg-primary/10 text-primary",
};

export default function Blog() {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="w-full">
      {/* PAGE HERO */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-background" />
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="text-primary text-xs uppercase tracking-[0.3em] font-medium mb-6 block">
              Insights & Resources
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-medium leading-[1.1] mb-6 text-foreground">
              The Executive<br />
              <span className="text-muted-foreground font-light italic">Perspective</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Practical intelligence for leaders operating at the intersection of governance, strategy, and GCC market complexity.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* FEATURED ARTICLE */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="aspect-[4/3] bg-muted/40 rounded-sm relative overflow-hidden border border-border">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#111111]/90 to-transparent">
                <span className="text-[#9B8B5F] text-xs uppercase tracking-wider">Featured</span>
              </div>
              <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                <div className="text-center p-8">
                  <div className="w-16 h-0.5 bg-primary/30 mx-auto mb-4" />
                  <p className="font-serif text-4xl text-foreground/10">01</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs px-2 py-1 rounded-sm font-medium ${categoryColors[featured.category]}`}>
                  {featured.category}
                </span>
                <span className="text-muted-foreground text-xs flex items-center gap-1">
                  <Calendar size={12} /> {featured.date}
                </span>
                <span className="text-muted-foreground text-xs">{featured.readTime}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-6 leading-snug">
                {featured.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">{featured.excerpt}</p>
              <Link
                href={`/blog/${featured.slug}`}
                className="inline-flex items-center gap-2 text-primary border-b border-primary pb-0.5 text-sm uppercase tracking-wider hover:gap-4 transition-all"
                data-testid={`link-blog-${featured.slug}`}
              >
                Read Article <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* ARTICLE GRID */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((article, i) => (
              <motion.div
                key={article.slug}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.2}
                className="bg-card border border-border rounded-sm overflow-hidden hover:border-primary/30 transition-colors group"
              >
                <div className="aspect-[3/2] bg-muted/40 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs px-2 py-1 rounded-sm font-medium ${categoryColors[article.category]}`}>
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {article.date}
                    </span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-serif text-lg text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-2 text-primary text-xs uppercase tracking-wider hover:gap-4 transition-all"
                    data-testid={`link-blog-${article.slug}`}
                  >
                    Read Article <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
