import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { articles } from "./blog";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const articleContent: Record<string, string> = {
  "board-governance-uae": `Board governance in the UAE operates within a multi-layered framework that blends international standards with regional norms. Whether you're serving on the board of a DIFC-listed entity, a mainland company, or a free-zone holding structure, the expectations placed on directors are both formal and cultural.

From a regulatory perspective, UAE governance frameworks draw from OECD principles while accommodating the concentrated ownership structures common in the region. Family businesses that have formalized board structures often operate with shareholder-directors who wear multiple hats—a dynamic that requires particular attention to conflict-of-interest management and the separation of executive authority from oversight.

What many international directors underestimate is the documentation standard expected in the GCC. Board minutes in the UAE tend to be comprehensive and serve as formal records for regulatory compliance, not merely internal references. Pre-read materials—board packs—are expected well in advance of meetings, and the sequence of agenda items often follows hierarchy-sensitive protocols.

The cultural dimension is equally significant. Meeting etiquette, the role of the chair, and the way dissent is expressed (or avoided) in formal settings vary considerably from Western boardroom norms. Understanding when to speak, how to frame a challenge to leadership, and how to build consensus before the meeting rather than during it are skills that experienced GCC board practitioners develop over time.

For non-executive directors new to the region, investing in context before the first meeting pays dividends for the entire tenure. The documentation, the relationships, and the governance rhythm of UAE boards are learnable—but they reward preparation.`,

  "multi-entity-management-gcc": `The GCC's economic geography has created a class of executive with a genuinely unusual challenge: operating across jurisdictions that, while geographically proximate, vary significantly in regulatory framework, cultural expectation, and operational rhythm.

A typical profile might involve a holding company registered in the DIFC, an operating subsidiary under KSA MISA, a joint venture in the Qatar Financial Centre, and a regional office in Bahrain. Each entity has its own governance obligations, its own local personnel requirements, and its own compliance calendar. The coordination burden on a principal managing this structure is substantial.

What makes this particularly demanding is not complexity alone—it is the speed at which decisions need to flow across entities. A board resolution in one jurisdiction may trigger reporting obligations in another. An investment approval at holding level must cascade correctly to subsidiary boards. A personnel change in Riyadh has implications for workforce nationalization targets in the KSA entity.

The infrastructure required to manage this well is not just organizational—it is informational. Someone must hold the complete picture of what each entity owes to whom, and when. That coordination function, when executed properly, is essentially a chief-of-staff role operating across jurisdictions simultaneously.

What separates adequate coordination from excellent coordination in this context is proactivity. The coordinator who flags an upcoming compliance deadline before the principal has to ask, who anticipates the governance implication of a proposed structure before it is formalized, and who manages the flow of information with the right level of discretion in each jurisdiction—that is the standard required.`,

  "confidentiality-family-offices": `Family offices occupy a peculiar position in the information ecosystem. They hold data that is simultaneously highly sensitive and frequently cross-referenced: investment performance, family dynamics, succession considerations, entity structures, and relationship networks.

The confidentiality requirement in this context is not simply about preventing information from leaving the organization. It is about controlling the flow of information within it—ensuring that the right people have access to what they need, and that no one else does. In multi-family-member structures, this becomes genuinely complex.

The legal infrastructure of confidentiality—NDAs, professional indemnity insurance, contractual segregation—is necessary but not sufficient. The real standard is operational: how information is stored, how it is communicated, who has access to which systems, and what happens when a team member departs.

For principals managing family office operations, the question is not whether a service provider is trustworthy in the abstract. It is whether their systems and processes make a breach practically difficult, and whether their legal framework provides recourse if one occurs.

The Executive Desk approaches this with explicit client segregation at the file and system level, encrypted communication channels, and NDAs calibrated to each engagement's sensitivity. But the more durable protection is the operational discipline that makes casual disclosure impossible by design.`,

  "executive-productivity-ramadan": `For executives operating across the GCC, Ramadan is not a period of reduced activity—it is a period of shifted activity. The distinction matters considerably.

Ramadan reconfigures the operational calendar in ways that are predictable and manageable with the right planning. Government working hours shorten. Private sector schedules adjust. The evening becomes socially and professionally active in ways that the afternoon is not. Decisions that might typically be made over a lunch meeting happen instead over Iftar, where relationship dynamics play a more prominent role.

The planning horizon for Ramadan should begin at least six weeks before the month starts. Board meetings, investor updates, and significant announcements that can be scheduled outside the month generally should be. Transactions that require rapid turnaround from government entities should account for extended timelines.

The productive executive during Ramadan front-loads strategic decisions to the pre-Ramadan period, uses the month for relationship cultivation rather than transactional acceleration, and plans the first two weeks of the following month as an intensified execution period when momentum returns.

Cultural sensitivity extends to communication style during the month. Scheduling pressure, aggressive timelines, and transactional urgency read differently during Ramadan. The executive who understands this calibrates their approach accordingly—and builds stronger relationships in the process.`,

  "ksa-misa-entity-setup": `Saudi Arabia's investment facilitation infrastructure has improved considerably since Vision 2030 made foreign direct investment a national priority. MISA—the Ministry of Investment of Saudi Arabia—has streamlined its processes, digitized significant portions of the application workflow, and created dedicated tracks for specific sectors.

That said, the practical experience of establishing a KSA entity still requires careful preparation. The documentation requirements are specific: commercial registration, company articles, authentication chains, and sector-specific approvals each have their own sequencing requirements. Errors in documentation order create delays that are difficult to compress.

The licensing category matters enormously. A trading license, a professional services license, and a technology sector license each carry different requirements, minimum capital thresholds, and local content expectations. For companies subject to Vision 2030's Saudization targets, the workforce implications of entity type must be factored into operational planning from the outset.

Beyond the formal process, the relationship dimension remains significant. Having local advisors who are known to MISA officials, who understand the informal communication channels, and who can navigate the inevitable ambiguities of regulatory interpretation is not a luxury—it is a practical necessity.

For GCC-active companies moving into the Kingdom, the experience of executives who have run this process before is invaluable. The sequence is learnable; the relationships are not.`,

  "stakeholder-alignment-hierarchy": `Stakeholder alignment in flat, Western-style organizations is already difficult. In the hierarchical structures common to GCC family businesses, government-adjacent entities, and regional conglomerates, it requires a fundamentally different approach.

In hierarchical organizations, alignment often needs to be built top-down before it can be confirmed bottom-up. A proposal that has not been pre-cleared with the relevant authority figure will frequently stall regardless of its merits, because no one below that authority will commit to a position without their implicit endorsement.

This creates a sequencing challenge for executives managing cross-departmental or cross-entity initiatives. The conventional change management playbook—build coalition, create momentum, present to leadership—often fails in these environments. The more effective sequence is to secure senior alignment first, communicate downward through appropriate channels, and then build operational commitment at the implementation level.

What makes this particularly nuanced is that the relationship architecture matters as much as the formal hierarchy. Understanding who has influence over whom, which relationships are based on trust versus obligation, and how decisions actually travel through an organization (as opposed to how the org chart suggests they should) is a fluency that develops over time and through proximity.

Executives new to the GCC's organizational culture frequently underestimate the importance of this dimension. The stakeholder alignment work that happens before a meeting—in private conversations, through intermediaries, and over extended relationship-building—is often more consequential than the meeting itself.`,
};

interface BlogPostProps {
  params: { slug: string };
}

export default function BlogPost({ params }: BlogPostProps) {
  const { slug } = params;
  const article = articles.find((a) => a.slug === slug);
  const content = articleContent[slug];

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-foreground mb-4">Article Not Found</h2>
          <Link href="/blog" className="text-primary text-sm uppercase tracking-wider">
            Return to Insights
          </Link>
        </div>
      </div>
    );
  }

  const relatedArticles = articles.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <div className="w-full">
      {/* BACK LINK */}
      <div className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm transition-colors"
            data-testid="link-back-to-blog"
          >
            <ArrowLeft size={14} /> Back to Insights
          </Link>
        </div>
      </div>

      {/* ARTICLE HEADER */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-background" />
        <div className="container mx-auto px-6 relative z-10 max-w-3xl">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
              <span className="text-primary text-xs uppercase tracking-wider font-medium px-2 py-1 bg-primary/10 rounded-sm">
                {article.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} /> {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} /> {article.readTime}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-medium leading-snug text-foreground mb-6">
              {article.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{article.excerpt}</p>
          </motion.div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* ARTICLE CONTENT */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="prose prose-lg prose-neutral dark:prose-invert max-w-none"
          >
            {content ? (
              content.split("\n\n").map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="text-muted-foreground leading-relaxed mb-6 text-base"
                >
                  {paragraph}
                </motion.p>
              ))
            ) : (
              <p className="text-muted-foreground leading-relaxed">{article.excerpt}</p>
            )}
          </motion.div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* RELATED ARTICLES */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="font-serif text-3xl text-foreground mb-12">Further Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((related, i) => (
              <motion.div
                key={related.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card border border-border rounded-sm p-6 hover:border-primary/30 transition-colors"
              >
                <span className="text-primary text-xs uppercase tracking-wider font-medium">
                  {related.category}
                </span>
                <h3 className="font-serif text-lg text-foreground mt-3 mb-3 leading-snug">
                  {related.title}
                </h3>
                <Link
                  href={`/blog/${related.slug}`}
                  className="text-primary text-xs uppercase tracking-wider inline-flex items-center gap-1 hover:gap-3 transition-all"
                  data-testid={`link-related-${related.slug}`}
                >
                  Read Article <ArrowLeft size={12} className="rotate-180" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
