"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MarketingNavbar } from "@/features/marketing/components/marketing-navbar";
import { MarketingFooter } from "@/features/marketing/components/marketing-footer";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Mail, Phone, MapPin, CheckCircle2, MessageSquare } from "lucide-react";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate server submission delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Contact form submitted:", data);
    setSubmitted(true);
    reset();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
      <MarketingNavbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center space-y-4 mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions about chapter onboarding, custom organization plans, or platform features? We&apos;re here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Contact Details & Map Card */}
            <div className="space-y-8">
              <div className="rounded-3xl bg-muted/20 border border-border/60 p-8 space-y-6">
                <h3 className="text-xl font-bold text-foreground">Contact Information</h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Global Headquarters</p>
                      <p className="text-muted-foreground">100 Enterprise Way, Suite 400<br />San Francisco, CA 94107</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Email Us</p>
                      <p className="text-muted-foreground">contact@growcle.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Phone Support</p>
                      <p className="text-muted-foreground">+1 (800) 555-GROW</p>
                    </div>
                  </div>
                </div>

                {/* Live Chat notice */}
                <div className="pt-4 border-t border-border/40 flex items-center gap-3 text-xs text-muted-foreground">
                  <MessageSquare className="h-4 w-4 text-indigo-500" />
                  <span>Future improvement: Live 24/7 Chat Integration coming soon.</span>
                </div>
              </div>

              {/* Interactive Location Map Mockup */}
              <div id="location" className="rounded-3xl border border-border/60 overflow-hidden bg-slate-900 shadow-sm relative h-64 flex flex-col justify-end p-6">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative z-10 space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500 text-white uppercase tracking-wider">San Francisco HQ</span>
                  <h4 className="text-lg font-bold text-white">Growcle Technology Center</h4>
                  <p className="text-xs text-slate-400">Visiting hours: Monday – Friday, 9:00 AM – 5:00 PM PST</p>
                </div>
              </div>

            </div>

            {/* Contact Form with Zod Validation */}
            <div className="rounded-3xl bg-background border border-border/60 p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-foreground mb-2">Send us a Message</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Fill out the form below and our team will respond within 24 business hours.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4 animate-in fade-in duration-300">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
                  <h4 className="text-lg font-bold text-foreground">Message Sent Successfully!</h4>
                  <p className="text-sm text-muted-foreground">
                    Thank you for reaching out. A platform specialist will get back to you shortly.
                  </p>
                  <Button 
                    onClick={() => setSubmitted(false)} 
                    variant="outline" 
                    className="rounded-xl mt-2"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-medium">Full Name</Label>
                    <Input 
                      id="fullName" 
                      placeholder="Jane Doe"
                      {...register("fullName")}
                      className="h-11 rounded-xl"
                    />
                    {errors.fullName && <p className="text-xs text-rose-500 font-medium">{errors.fullName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-medium">Work Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="jane@company.com"
                      {...register("email")}
                      className="h-11 rounded-xl"
                    />
                    {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="font-medium">Subject</Label>
                    <Input 
                      id="subject" 
                      placeholder="Chapter Onboarding / General Inquiry"
                      {...register("subject")}
                      className="h-11 rounded-xl"
                    />
                    {errors.subject && <p className="text-xs text-rose-500 font-medium">{errors.subject.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="font-medium">Message</Label>
                    <textarea 
                      id="message" 
                      rows={4}
                      placeholder="Tell us how we can help you..."
                      {...register("message")}
                      className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {errors.message && <p className="text-xs text-rose-500 font-medium">{errors.message.message}</p>}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    {isSubmitting ? "Sending Message..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>

          </div>

        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
