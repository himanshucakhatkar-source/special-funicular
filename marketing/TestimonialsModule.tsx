import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { 
  Star, 
  TrendingUp, 
  Users, 
  Award,
  Quote,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Testimonial {
  id: string;
  company: string;
  companyLogo?: string;
  industry: string;
  companySize: string;
  author: string;
  role: string;
  avatar?: string;
  quote: string;
  rating: number;
  results?: {
    metric: string;
    value: string;
    icon?: 'trending' | 'users' | 'award';
  }[];
}

interface TestimonialsModuleProps {
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    company: 'TechCorp Solutions',
    industry: 'Technology',
    companySize: '500-1000 employees',
    author: 'Sarah Mitchell',
    role: 'VP of Engineering',
    quote: "Honourus transformed how we recognize contributions. The AI-powered attribution caught contributions we were completely missing in our sprint reviews. Team morale increased by 23% in just 3 months.",
    rating: 5,
    results: [
      { metric: 'Retention Increase', value: '+15%', icon: 'trending' },
      { metric: 'Team Satisfaction', value: '+23%', icon: 'users' },
      { metric: 'Recognition Events', value: '3.2x', icon: 'award' },
    ]
  },
  {
    id: '2',
    company: 'Global Financial Services',
    industry: 'Finance',
    companySize: '1000+ employees',
    author: 'Marcus Chen',
    role: 'Head of People Operations',
    quote: "The immutable trust ledger solved our biggest problem: proving fair credit distribution. Our team now trusts the system completely, and we've seen a dramatic reduction in disputes.",
    rating: 5,
    results: [
      { metric: 'Dispute Reduction', value: '-78%', icon: 'trending' },
      { metric: 'Transparency Score', value: '9.4/10', icon: 'award' },
      { metric: 'Manager Time Saved', value: '12hrs/week', icon: 'users' },
    ]
  },
  {
    id: '3',
    company: 'InnovateLabs',
    industry: 'Healthcare Tech',
    companySize: '200-500 employees',
    author: 'Dr. Emily Rodriguez',
    role: 'CTO',
    quote: "Integrating Honourus with our existing Jira and Slack setup took less than an hour. The two-way sync is flawless, and our engineers love seeing their contributions recognized automatically.",
    rating: 5,
    results: [
      { metric: 'Setup Time', value: '<1 hour', icon: 'trending' },
      { metric: 'Daily Active Users', value: '94%', icon: 'users' },
      { metric: 'Integration Score', value: '10/10', icon: 'award' },
    ]
  }
];

export function TestimonialsModule({ testimonials = defaultTestimonials }: TestimonialsModuleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const currentTestimonial = testimonials[currentIndex];

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getResultIcon = (icon?: 'trending' | 'users' | 'award') => {
    switch (icon) {
      case 'trending':
        return TrendingUp;
      case 'users':
        return Users;
      case 'award':
        return Award;
      default:
        return TrendingUp;
    }
  };

  return (
    <div className="py-20 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-accent/5 to-background pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-primary to-accent text-white border-0">
            Customer Success Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Leading Organizations
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how companies are building cultures of trust and boosting team performance
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="relative overflow-hidden">
                {/* Quote Icon Background */}
                <Quote className="absolute top-8 right-8 h-32 w-32 text-primary/5 rotate-12" />

                <div className="p-8 md:p-12 relative">
                  {/* Company Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{currentTestimonial.company}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{currentTestimonial.industry}</Badge>
                          <Badge variant="secondary">{currentTestimonial.companySize}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex gap-1">
                      {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl mb-8 text-foreground/90 leading-relaxed">
                    "{currentTestimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4 mb-8">
                    <Avatar className="h-14 w-14 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                        {currentTestimonial.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{currentTestimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{currentTestimonial.role}</p>
                    </div>
                  </div>

                  {/* Results Metrics */}
                  {currentTestimonial.results && (
                    <div className="border-t border-border pt-6">
                      <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                        Measurable Impact
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {currentTestimonial.results.map((result, index) => {
                          const Icon = getResultIcon(result.icon);
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10"
                            >
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                  {result.value}
                                </div>
                                <p className="text-xs text-muted-foreground">{result.metric}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="h-12 w-12 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'w-8 bg-primary' 
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="h-12 w-12 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '10,000+', label: 'Teams Trust Us' },
            { value: '98%', label: 'Satisfaction Rate' },
            { value: '24/7', label: 'Support Available' },
            { value: '99.9%', label: 'Uptime SLA' }
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
