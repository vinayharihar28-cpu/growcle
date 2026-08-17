"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  chapter: string;
  revenue: string;
  avatar: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Founder, Apex Commercial Real Estate",
    chapter: "Bay Area Innovators Chapter",
    revenue: "$840,000+ Closed Revenue",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    quote: "Growcle transformed our chapter meetings. The ability to track 1-to-1s and mathematically tie closed revenue to passed referrals gave our members total confidence in the ROI.",
    rating: 5,
  },
  {
    id: 2,
    name: "Marcus Vance",
    role: "Managing Director, Vance Financial Solutions",
    chapter: "Metro Tech & Finance Chapter",
    revenue: "$1.2M+ Closed Revenue",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    quote: "As a chapter president, automated dues collection, attendance tracking, and real-time traffic light analytics cut our administrative burden by 80%. Highly recommended!",
    rating: 5,
  },
  {
    id: 3,
    name: "Elena Rostova",
    role: "Principal Architect, Studio Form",
    chapter: "Pacific Design Chapter",
    revenue: "$620,000+ Closed Revenue",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    quote: "The referral pipeline feature allows me to track every lead from introduction to invoice. I've doubled my qualified client pipeline in less than 6 months.",
    rating: 5,
  },
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-24 bg-background border-y border-border/40 relative overflow-hidden">
      {/* Glow backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary tracking-wide uppercase">
            Real Stories, Verified ROI
          </h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Trusted by top chapter leaders and high-performing members
          </p>
        </div>

        <div className="mt-16 mx-auto max-w-4xl">
          <div className="relative rounded-3xl bg-muted/30 p-8 sm:p-12 border border-border/60 shadow-xl backdrop-blur-sm">
            <Quote className="absolute top-6 right-8 h-16 w-16 text-primary/10" />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar & Revenue Pill */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative h-24 w-24 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {current.revenue}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left space-y-4">
                {/* Rating */}
                <div className="flex items-center justify-center md:justify-start gap-1">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <blockquote className="text-xl font-medium leading-relaxed text-foreground italic">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>

                <div>
                  <div className="font-bold text-lg text-foreground">{current.name}</div>
                  <div className="text-sm text-primary font-medium">{current.role}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{current.chapter}</div>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="mt-8 pt-6 border-t border-border/40 flex items-center justify-between">
              {/* Dot Indicators */}
              <div className="flex gap-2">
                {testimonials.map((t, index) => (
                  <button
                    key={t.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === currentIndex ? "w-8 bg-primary" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  className="rounded-full h-10 w-10 border-border/80 hover:bg-muted"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  className="rounded-full h-10 w-10 border-border/80 hover:bg-muted"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
