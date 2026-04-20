import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, MapPin, Clock, Shield } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: "easeOut" },
  }),
};

const countries = ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman", "United Kingdom", "United States", "Other"];
const enquiryTypes = [
  "Strategic Coordination",
  "Governance Support",
  "Cross-Border Operations",
  "Board Documentation",
  "Travel Logistics",
  "Other",
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    role: "",
    country: "",
    enquiryType: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full">
      {/* PAGE HERO */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-background" />
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="text-primary text-xs uppercase tracking-[0.3em] font-medium mb-6 block">
              Begin the Conversation
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-medium leading-[1.1] mb-6 text-foreground">
              Let's Build Your<br />
              <span className="text-muted-foreground font-light italic">
                Next Chapter.
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Tell us what you're navigating. We'll respond within one business day with complete confidentiality.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* FORM SECTION */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* SIDEBAR INFO */}
            <div className="lg:col-span-2 space-y-10">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield size={14} className="text-primary" />
                  </div>
                  <h3 className="font-serif text-xl text-foreground">Confidentiality First</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  All enquiries are treated with the same confidentiality as our active engagements. Your information is never shared, stored insecurely, or referenced outside of this conversation.
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={1}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock size={14} className="text-primary" />
                  </div>
                  <h3 className="font-serif text-xl text-foreground">Response Time</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We respond to all enquiries within one business day. For urgent matters, please indicate the nature of the time constraint in your message.
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={2}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin size={14} className="text-primary" />
                  </div>
                  <h3 className="font-serif text-xl text-foreground">Our Presence</h3>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    UAE — Primary base
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    Saudi Arabia — Active
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    Qatar — Active
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={3}
                className="border border-primary/20 bg-primary/5 rounded-sm p-6"
              >
                <p className="font-serif text-foreground italic text-base leading-relaxed">
                  "Every engagement begins with a conversation. Ours are deliberate, efficient, and completely confidential."
                </p>
              </motion.div>
            </div>

            {/* FORM */}
            <motion.div
              className="lg:col-span-3"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
            >
              {submitted ? (
                <div className="h-full flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <ArrowRight size={24} className="text-primary" />
                    </div>
                    <h2 className="font-serif text-3xl text-foreground mb-4">
                      Enquiry Received
                    </h2>
                    <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                      Thank you. We'll review your message and respond within one business day with complete confidentiality.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-contact">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs uppercase tracking-wider text-muted-foreground mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        data-testid="input-name"
                        className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-xs uppercase tracking-wider text-muted-foreground mb-2"
                      >
                        Company / Organisation *
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        required
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Your company"
                        data-testid="input-company"
                        className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="role"
                        className="block text-xs uppercase tracking-wider text-muted-foreground mb-2"
                      >
                        Your Role *
                      </label>
                      <input
                        id="role"
                        name="role"
                        type="text"
                        required
                        value={form.role}
                        onChange={handleChange}
                        placeholder="e.g. CEO, Managing Director"
                        data-testid="input-role"
                        className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="country"
                        className="block text-xs uppercase tracking-wider text-muted-foreground mb-2"
                      >
                        Country *
                      </label>
                      <select
                        id="country"
                        name="country"
                        required
                        value={form.country}
                        onChange={handleChange}
                        data-testid="select-country"
                        className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors appearance-none"
                      >
                        <option value="" disabled>Select country</option>
                        {countries.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="enquiryType"
                      className="block text-xs uppercase tracking-wider text-muted-foreground mb-2"
                    >
                      Nature of Enquiry *
                    </label>
                    <select
                      id="enquiryType"
                      name="enquiryType"
                      required
                      value={form.enquiryType}
                      onChange={handleChange}
                      data-testid="select-enquiry-type"
                      className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors appearance-none"
                    >
                      <option value="" disabled>Select enquiry type</option>
                      {enquiryTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs uppercase tracking-wider text-muted-foreground mb-2"
                    >
                      What Are You Navigating? *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Describe your current situation or challenge. The more context you provide, the more useful our initial response will be."
                      data-testid="textarea-message"
                      className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  <p className="text-muted-foreground text-xs leading-relaxed">
                    By submitting this form, you confirm that all information provided will be treated with absolute confidentiality in accordance with our data protection protocols.
                  </p>

                  <button
                    type="submit"
                    data-testid="button-submit-contact"
                    className="w-full bg-primary text-primary-foreground py-4 text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-3 font-medium"
                  >
                    Submit Enquiry <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
