import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { INTERVAL } from '@/utils/timing';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  project?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    role: 'Director of Research',
    company: 'QuantumLabs',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    content:
      "Meshal's work on our quantum simulation platform exceeded all expectations. His ability to translate complex physics into performant code is remarkable.",
    rating: 5,
    project: 'QMLab',
  },
  {
    id: '2',
    name: 'Ahmed Al-Rashid',
    role: 'CTO',
    company: 'TechFlow Solutions',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed',
    content:
      'The MEZAN workflow automation system transformed our operations. Reduced processing time by 60% and the bilingual support was seamless.',
    rating: 5,
    project: 'MEZAN',
  },
  {
    id: '3',
    name: 'Prof. Michael Torres',
    role: 'Head of Computational Physics',
    company: 'MIT',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    content:
      'SimCore is now an essential tool in our research lab. The real-time visualization capabilities have accelerated our research significantly.',
    rating: 5,
    project: 'SimCore',
  },
  {
    id: '4',
    name: 'Lisa Park',
    role: 'VP of Engineering',
    company: 'DataSync Inc',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
    content:
      'Working with Meshal was a pleasure. His deep understanding of optimization algorithms helped us solve problems we thought were intractable.',
    rating: 5,
    project: 'OptiLibria',
  },
  {
    id: '5',
    name: 'Dr. James Wilson',
    role: 'AI Research Lead',
    company: 'Neural Dynamics',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    content:
      'The TalAI framework has become foundational to our ML experiments. Clean architecture, excellent documentation, and brilliant insights.',
    rating: 5,
    project: 'TalAI',
  },
];

export function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, INTERVAL.TESTIMONIAL_ROTATION);

    return () => clearInterval(interval);
  }, [isPaused]);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-2xl" />

      <div className="relative p-8 md:p-12 rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm overflow-hidden">
        {/* Quote icon */}
        <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/20" />

        {/* Main content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTestimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative z-10"
          >
            {/* Rating */}
            <div className="flex gap-1 mb-6 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < activeTestimonial.rating
                      ? 'text-jules-yellow fill-jules-yellow'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-lg md:text-xl text-center leading-relaxed mb-8 max-w-3xl mx-auto">
              "{activeTestimonial.content}"
            </blockquote>

            {/* Author */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={activeTestimonial.avatar}
                  alt={activeTestimonial.name}
                  className="w-16 h-16 rounded-full border-2 border-primary/50"
                />
                {activeTestimonial.project && (
                  <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-xs font-mono bg-primary text-primary-foreground">
                    {activeTestimonial.project}
                  </span>
                )}
              </div>

              <div className="text-center">
                <p className="font-semibold text-lg">{activeTestimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {activeTestimonial.role} at{' '}
                  <span className="text-primary">{activeTestimonial.company}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={prev}
            className="rounded-full hover:bg-primary/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? 'bg-primary w-6'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            className="rounded-full hover:bg-primary/10"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/20">
          <motion.div
            key={activeIndex}
            initial={{ width: '0%' }}
            animate={{ width: isPaused ? undefined : '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-primary to-accent"
          />
        </div>
      </div>

      {/* Floating testimonial previews */}
      <div className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 flex-col gap-2">
        {testimonials.slice(0, 3).map((t, i) => (
          <motion.button
            key={t.id}
            onClick={() => setActiveIndex(i)}
            whileHover={{ scale: 1.1, x: 5 }}
            className={`w-10 h-10 rounded-full border-2 overflow-hidden transition-all ${
              i === activeIndex
                ? 'border-primary ring-2 ring-primary/30'
                : 'border-border/50 opacity-50 hover:opacity-100'
            }`}
          >
            <img src={t.avatar} alt={t.name} className="w-full h-full" />
          </motion.button>
        ))}
      </div>

      <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 flex-col gap-2">
        {testimonials.slice(3).map((t, i) => (
          <motion.button
            key={t.id}
            onClick={() => setActiveIndex(i + 3)}
            whileHover={{ scale: 1.1, x: -5 }}
            className={`w-10 h-10 rounded-full border-2 overflow-hidden transition-all ${
              i + 3 === activeIndex
                ? 'border-primary ring-2 ring-primary/30'
                : 'border-border/50 opacity-50 hover:opacity-100'
            }`}
          >
            <img src={t.avatar} alt={t.name} className="w-full h-full" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
