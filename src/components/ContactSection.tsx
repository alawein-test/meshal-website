import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Copy, Check, Calendar, ArrowRight, Send, MessageSquare } from 'lucide-react';
import { z } from 'zod';
import { SectionHeader } from './ui/section-header';
import { NeonCard } from './ui/neon-card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().max(100, 'Name must be less than 100 characters').optional(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;
type FormErrors = Partial<Record<keyof ContactFormData, string>>;

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = 'meshal@berkeley.edu';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    toast.success('Email copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const validateField = (field: keyof ContactFormData, value: string) => {
    const result = contactSchema.shape[field].safeParse(value);
    if (!result.success) {
      setErrors((prev) => ({ ...prev, [field]: result.error.errors[0].message }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast.error('Please fix the errors below');
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Message sent! I'll get back to you soon.");
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-32 relative" ref={ref}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-jules-green/5 via-transparent to-transparent pointer-events-none" />

      <div className="container px-4 max-w-5xl mx-auto">
        <SectionHeader
          title="Let's Connect"
          subtitle="Interested in collaboration, research opportunities, or just want to chat"
          color="green"
          align="center"
        />

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <NeonCard color="green" hover={false} glow>
              <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-jules-green" />
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-mono text-muted-foreground mb-2 block">
                    Name (optional)
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) validateField('name', e.target.value);
                    }}
                    onBlur={(e) => validateField('name', e.target.value)}
                    placeholder="Your name"
                    className={`bg-jules-surface/50 border-jules-green/30 focus:border-jules-green focus:ring-jules-green/20 ${errors.name ? 'border-destructive' : ''}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1 font-mono">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-mono text-muted-foreground mb-2 block">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) validateField('email', e.target.value);
                    }}
                    onBlur={(e) => validateField('email', e.target.value)}
                    placeholder="your@email.com"
                    className={`bg-jules-surface/50 border-jules-green/30 focus:border-jules-green focus:ring-jules-green/20 ${errors.email ? 'border-destructive' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1 font-mono">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-mono text-muted-foreground mb-2 block">
                    Message *
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) validateField('message', e.target.value);
                    }}
                    onBlur={(e) => validateField('message', e.target.value)}
                    placeholder="What would you like to discuss?"
                    rows={4}
                    className={`bg-jules-surface/50 border-jules-green/30 focus:border-jules-green focus:ring-jules-green/20 resize-none ${errors.message ? 'border-destructive' : ''}`}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive mt-1 font-mono">{errors.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-jules-green hover:bg-jules-green/90 text-jules-dark font-mono font-bold"
                  style={{ boxShadow: '0 0 20px hsl(var(--jules-green) / 0.4)' }}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Send className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </NeonCard>
          </motion.div>

          {/* Quick Contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6"
          >
            {/* Email card */}
            <NeonCard color="cyan">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ background: 'hsl(var(--jules-cyan) / 0.15)' }}
                  >
                    <Mail className="w-6 h-6 text-jules-cyan" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                      Email
                    </span>
                    <p className="font-mono text-jules-cyan">{email}</p>
                  </div>
                </div>
                <motion.button
                  onClick={handleCopy}
                  className="p-3 rounded-lg border border-jules-cyan/30 hover:bg-jules-cyan/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Copy email"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-jules-green" />
                  ) : (
                    <Copy className="w-5 h-5 text-jules-cyan" />
                  )}
                </motion.button>
              </div>
            </NeonCard>

            {/* Schedule call */}
            <NeonCard color="yellow">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ background: 'hsl(var(--jules-yellow) / 0.15)' }}
                >
                  <Calendar className="w-6 h-6 text-jules-yellow" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Schedule a Call</h4>
                  <p className="text-sm text-muted-foreground">Book a 30-minute chat</p>
                </div>
              </div>
              <a
                href="mailto:meshal@berkeley.edu?subject=Schedule%20a%20Call&body=Hi%20Meshal%2C%0A%0AI%27d%20like%20to%20schedule%20a%20call%20to%20discuss..."
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full border-jules-yellow/30 text-jules-yellow hover:bg-jules-yellow/10 font-mono"
                >
                  Request a Meeting
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </NeonCard>

            {/* Response time */}
            <NeonCard color="magenta" hover={false}>
              <div className="text-center py-4">
                <span className="text-4xl font-bold text-jules-magenta font-display">{'<24h'}</span>
                <p className="text-sm text-muted-foreground font-mono mt-2">
                  Average response time
                </p>
              </div>
            </NeonCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
