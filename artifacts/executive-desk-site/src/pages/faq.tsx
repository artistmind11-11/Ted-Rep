import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: "easeOut" },
  }),
};

const faqs = [
  {
    question: "How is client confidentiality maintained?",
    answer:
      "Confidentiality is the foundation of every engagement. We operate with fully encrypted devices and cloud storage, secure VPN routing on all network usage, and automated secure backups. All client data is stored in isolated folders with granular access controls. We execute mutual or one-way NDAs based on client preference, carry AED 500K–1M in Professional Indemnity Insurance, and comply fully with UAE data protection regulations. Explicit confidentiality obligations are embedded in every service agreement. Zero cross-client information sharing is a non-negotiable operating principle.",
  },
  {
    question: "What sectors do you serve?",
    answer:
      "Our track record spans governance-driven environments across Real Estate Development, Luxury Retail, F&B Operations, and Investment Management—both listed companies and private organizations. We work with executives at Series A–C fintech companies, regional MNC general managers, family office investment managers, and non-executive directors serving on multiple boards simultaneously. If your operating environment is complex, multi-jurisdictional, or requires absolute discretion, we are likely a fit.",
  },
  {
    question: "Which geographies do you cover?",
    answer:
      "We are natively based in the UAE, with deep operational fluency across the UAE (including Dubai, Abu Dhabi, and the northern emirates), Saudi Arabia (Riyadh, Jeddah, and NEOM corridor), and Qatar (Doha and the QFC). We also coordinate across international jurisdictions—particularly London and New York—where GCC clients frequently operate or raise capital. Our coordination adapts to your time zones and travel schedules, not the other way around.",
  },
  {
    question: "How does the onboarding process work?",
    answer:
      "Onboarding follows a structured three-phase process. Discovery: we map your priorities, stakeholders, communication preferences, and existing systems. Integration: we establish secure access protocols, define workflows, and ensure all systems are configured correctly. Ongoing Partnership: we operate on a weekly cadence with proactive updates and continuous calibration as your needs evolve. We typically reach full operational integration within two weeks of engagement commencement.",
  },
  {
    question: "How is pricing structured?",
    answer:
      "Engagements are structured on a retainer basis, calibrated to the scope and complexity of each client's needs. We do not disclose standard pricing publicly, as every engagement is designed specifically for the principal's operational reality. We recommend beginning with a consultation to understand your requirements before discussing a proposal. All pricing conversations are treated with the same confidentiality as our service delivery.",
  },
  {
    question: "What makes The Executive Desk different from an offshore VA service?",
    answer:
      "The difference is context. Generic offshore models operate without understanding of GCC regulatory frameworks, board governance norms, cultural communication protocols, or the relationship dynamics specific to the region. We navigate UAE free zones, KSA MISA requirements, and Qatar QFC compliance as a matter of course—not as specialist consulting. We understand the specific board meeting formats used in the GCC, the documentation standards expected by regional investors, and the cultural calendar that shapes executive life across the Gulf. Local expertise accelerates execution and eliminates operational friction in ways that remote services cannot replicate.",
  },
  {
    question: "What does your Professional Indemnity Insurance cover?",
    answer:
      "We carry Professional Indemnity Insurance in the range of AED 500,000 to AED 1,000,000, providing coverage for claims arising from professional services rendered. This provides clients with a formal contractual protection layer in addition to the operational and legal confidentiality safeguards already in place. Insurance certificates are available upon request to qualified clients.",
  },
  {
    question: "What data security protocols are in place?",
    answer:
      "Our security infrastructure is built around the principle that confidentiality requires active protection, not passive assumptions. We use fully encrypted devices, OneDrive for Business with Data Loss Prevention (DLP), mandatory two-factor authentication on all systems, secure VPN routing for all network usage, and automated encrypted backups. Client data is segregated at the folder level with granular access controls. We comply with UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection and operate under contractual obligations that make any deviation from these standards a formal breach.",
  },
  {
    question: "Can you support executives during sensitive periods, such as a restructuring or a board change?",
    answer:
      "This is precisely the context in which structured, discreet coordination matters most. We have experience supporting principals through leadership transitions, restructuring periods, succession planning processes, and governance reviews. In these situations, our approach emphasizes strict information hygiene, deliberate communication sequencing, and proactive anticipation of coordination needs before they become urgent. We do not discuss the nature of any client's sensitive engagement with any third party.",
  },
  {
    question: "How do I begin the process?",
    answer:
      "The process begins with a confidential consultation—a direct conversation about your current operational challenges and what structured support would look like. Use the Contact page to submit an initial enquiry, and we will respond within one business day. There is no obligation attached to the initial conversation, and all information shared is protected from the moment you reach out.",
  },
];

function FAQItem({
  faq,
  index,
}: {
  faq: { question: string; answer: string };
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index * 0.1}
      className="border-b border-border last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-6 flex items-start justify-between gap-4 hover:text-primary transition-colors group"
        data-testid={`button-faq-${index}`}
        aria-expanded={open}
      >
        <span className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">
          {faq.question}
        </span>
        <ChevronDown
          size={20}
          className={`flex-shrink-0 text-primary transition-transform duration-300 mt-1 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="text-muted-foreground leading-relaxed pb-6 text-sm pr-8">
          {faq.answer}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <div className="w-full">
      {/* PAGE HERO */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-background" />
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="text-primary text-xs uppercase tracking-[0.3em] font-medium mb-6 block">
              Common Questions
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-medium leading-[1.1] mb-6 text-foreground">
              Questions We<br />
              <span className="text-muted-foreground font-light italic">
                Hear Most Often
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Direct answers to the questions senior executives ask before engaging. If yours isn't here, reach out directly.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* FAQ ACCORDION */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="divide-y-0">
            {faqs.map((faq, i) => (
              <FAQItem key={faq.question} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* STILL HAVE QUESTIONS */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl font-serif font-medium text-foreground mb-6">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
              Every situation is different. If your question isn't answered here, reach out directly and we'll respond within one business day.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
              data-testid="link-faq-contact"
            >
              Contact Us <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
