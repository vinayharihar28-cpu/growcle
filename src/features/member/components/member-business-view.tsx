"use client";

import React, { useEffect, useState } from "react";
import { Building2, Globe, Mail, Phone, MapPin, Save, CheckCircle2, Sparkles, Target, ThumbsDown } from "lucide-react";
import {
  getMemberContext,
  getMemberBusiness,
  updateMemberBusiness,
  MemberContext,
} from "../actions/member-actions";
import { MemberHeaderBar } from "./member-header-bar";

export function MemberBusinessView() {
  const [context, setContext] = useState<MemberContext | null>(null);
  const [business, setBusiness] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [form, setForm] = useState({
    businessName: "",
    industry: "",
    businessCategory: "",
    companyDescription: "",
    businessAddress: "",
    businessPhone: "",
    businessEmail: "",
    website: "",
    whatIDo: "",
    whoIHelp: "",
    bestReferral: "",
    notAGoodReferral: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getMemberContext();
      setContext(ctx);
      const b = await getMemberBusiness(ctx.memberId);
      setBusiness(b);
      setForm({
        businessName: b.businessName || "",
        industry: b.industry || "",
        businessCategory: b.businessCategory || "",
        companyDescription: b.companyDescription || "",
        businessAddress: b.businessAddress || "",
        businessPhone: b.businessPhone || "",
        businessEmail: b.businessEmail || "",
        website: b.website || "",
        whatIDo: b.whatIDo || "",
        whoIHelp: b.whoIHelp || "",
        bestReferral: b.bestReferral || "",
        notAGoodReferral: b.notAGoodReferral || "",
      });
    } catch (err) {
      console.error("Failed to load business profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !form.businessName) return;
    setSubmitting(true);
    try {
      await updateMemberBusiness(context.memberId, {
        businessName: form.businessName,
        industry: form.industry,
        businessCategory: form.businessCategory,
        companyDescription: form.companyDescription,
        businessAddress: form.businessAddress,
        businessPhone: form.businessPhone,
        businessEmail: form.businessEmail,
        website: form.website,
        whatIDo: form.whatIDo,
        whoIHelp: form.whoIHelp,
        bestReferral: form.bestReferral,
        notAGoodReferral: form.notAGoodReferral,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update business profile", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {context && <MemberHeaderBar context={context} />}

      <div>
        <h2 className="text-xl font-bold text-foreground">My Chapter Business Profile</h2>
        <p className="text-sm text-muted-foreground">
          Define your industry category, target clientele, and ideal referrals to empower chapter peers.
        </p>
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          Loading business profile...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Core Business Details */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Company & Entity Information</h3>
                </div>
                {savedSuccess && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Saved
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Business / Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Industry / Sector *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Information Technology"
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Sub-Category / Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Cloud Security & SaaS Architecture"
                    value={form.businessCategory}
                    onChange={(e) => setForm({ ...form, businessCategory: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Official Website</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Business Contact Email</label>
                  <input
                    type="email"
                    value={form.businessEmail}
                    onChange={(e) => setForm({ ...form, businessEmail: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Business Phone</label>
                  <input
                    type="tel"
                    value={form.businessPhone}
                    onChange={(e) => setForm({ ...form, businessPhone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Office / Headquarters Address</label>
                <input
                  type="text"
                  value={form.businessAddress}
                  onChange={(e) => setForm({ ...form, businessAddress: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Services & Product Description</label>
                <textarea
                  rows={3}
                  value={form.companyDescription}
                  onChange={(e) => setForm({ ...form, companyDescription: e.target.value })}
                  placeholder="Explain your core capabilities, track record, and key deliverables..."
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Networking Synergy Guide */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-foreground">Networking Clarity Prompts</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Target className="h-4 w-4 text-emerald-500" />
                    <span>Best Referral For Me</span>
                  </label>
                  <textarea
                    rows={3}
                    value={form.bestReferral}
                    onChange={(e) => setForm({ ...form, bestReferral: e.target.value })}
                    placeholder="Specific company size, decision maker, or project type..."
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <ThumbsDown className="h-4 w-4 text-rose-500" />
                    <span>Not A Good Referral</span>
                  </label>
                  <textarea
                    rows={2}
                    value={form.notAGoodReferral}
                    onChange={(e) => setForm({ ...form, notAGoodReferral: e.target.value })}
                    placeholder="Leads outside your capacity or budget requirements..."
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{submitting ? "Saving Changes..." : "Save Business Profile"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
