"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ArrowRight, Globe, Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

export function MarketingFooter() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="border-t bg-slate-950 text-slate-200">
      {/* Top Footer Section */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white font-extrabold shadow-md">
                G
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Growcle
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The premier white-label business networking platform. Empowering organizations and local chapters to track 1-to-1s, pass referrals, and scale closed business.
            </p>

            {/* Newsletter Subscription */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Subscribe to Networking Insights
              </h4>
              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4" /> Thank you for subscribing!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <Input 
                    type="email" 
                    placeholder="Enter your work email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500 h-10 rounded-xl"
                  />
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white h-10 px-4 rounded-xl shrink-0 font-medium">
                    Subscribe <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Links Column 1 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Platform</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/#features" className="hover:text-indigo-400 transition-colors">Features Grid</Link></li>
              <li><Link href="/chapters" className="hover:text-indigo-400 transition-colors">Find a Chapter</Link></li>
              <li><Link href="/showcase" className="hover:text-indigo-400 transition-colors">Showcase & Demos</Link></li>
              <li><Link href="/register" className="hover:text-indigo-400 transition-colors">Visitor Registration</Link></li>
              <li><Link href="/login" className="hover:text-indigo-400 transition-colors">Member Portal</Link></li>
            </ul>
          </div>

          {/* Quick Links Column 2 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link href="/about#team" className="hover:text-indigo-400 transition-colors">Leadership Team</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact Support</Link></li>
              <li><Link href="/contact#location" className="hover:text-indigo-400 transition-colors">Global Offices</Link></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Contact Info</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>100 Enterprise Way, Suite 400, San Francisco, CA 94107</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>contact@growcle.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>+1 (800) 555-GROW</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Growcle SaaS Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Security</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
