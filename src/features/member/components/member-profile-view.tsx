"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Twitter,
  Save,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Camera,
  KeyRound,
  Target,
  ThumbsDown,
  ExternalLink,
} from "lucide-react";
import {
  getMemberContext,
  getMemberProfile,
  updateMemberProfile,
  getMemberBusiness,
  updateMemberBusiness,
  requestPasswordReset,
  MemberContext,
} from "../actions/member-actions";
import { MemberHeaderBar } from "./member-header-bar";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";

export function MemberProfileView() {
  const [context, setContext] = useState<MemberContext | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [business, setBusiness] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingPersonal, setSubmittingPersonal] = useState(false);
  const [submittingBusiness, setSubmittingBusiness] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedBizSuccess, setSavedBizSuccess] = useState(false);
  const [resetStatus, setResetStatus] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Personal form
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    website: "",
    linkedin: "",
    twitter: "",
    profileImage: "",
  });

  // Business form
  const [bizForm, setBizForm] = useState({
    businessName: "",
    industry: "",
    businessCategory: "",
    description: "",
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
      const [p, b] = await Promise.all([
        getMemberProfile(ctx.memberId),
        getMemberBusiness(ctx.memberId),
      ]);
      setProfile(p);
      setBusiness(b);

      setForm({
        firstName: p.firstName || "",
        lastName: p.lastName || "",
        phone: p.phone || "",
        bio: p.bio || "",
        website: p.website || "",
        linkedin: p.linkedin || "",
        twitter: p.twitter || "",
        profileImage: p.profileImage || "",
      });

      setBizForm({
        businessName: b.businessName || "",
        industry: b.industry || "",
        businessCategory: b.businessCategory || "",
        description: b.companyDescription || "",
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
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context) return;
    setSubmittingPersonal(true);
    try {
      await updateMemberProfile(context.memberId, {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phone,
        bio: form.bio,
        website: form.website,
        linkedin: form.linkedin,
        twitter: form.twitter,
        profileImage: form.profileImage,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setSubmittingPersonal(false);
    }
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context) return;
    setSubmittingBusiness(true);
    try {
      await updateMemberBusiness(context.memberId, {
        businessName: bizForm.businessName,
        industry: bizForm.industry,
        businessCategory: bizForm.businessCategory,
        companyDescription: bizForm.description,
        businessAddress: bizForm.businessAddress,
        businessPhone: bizForm.businessPhone,
        businessEmail: bizForm.businessEmail,
        website: bizForm.website,
        whatIDo: bizForm.whatIDo,
        whoIHelp: bizForm.whoIHelp,
        bestReferral: bizForm.bestReferral,
        notAGoodReferral: bizForm.notAGoodReferral,
      });
      setSavedBizSuccess(true);
      setTimeout(() => setSavedBizSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update business profile", err);
    } finally {
      setSubmittingBusiness(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!profile?.email) return;
    setIsResetting(true);
    try {
      const res = await requestPasswordReset(profile.email);
      setResetStatus(res.message);
    } catch (err) {
      console.error("Password reset error", err);
      setResetStatus("Unable to request password reset. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {context && <MemberHeaderBar context={context} />}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Member Profile & Business Hub</h2>
          <p className="text-sm text-muted-foreground">
            Manage your personal identity, circular avatar, credentials, and business networking profile in one place.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          Loading member profile...
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Section: Personal Profile Form + Member Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Details Form */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Personal Identity</h3>
                </div>
                {savedSuccess && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Changes Saved
                  </span>
                )}
              </div>

              {/* Avatar Photo Section (Circle) */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border/60">
                <Avatar className="h-20 w-20 rounded-full border-2 border-primary/30 shadow-md">
                  <AvatarImage src={form.profileImage || undefined} alt={form.firstName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                    {form.firstName[0] || "M"}{form.lastName[0] || ""}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <h4 className="text-sm font-semibold text-foreground">Profile Picture</h4>
                  <p className="text-xs text-muted-foreground">
                    Synced automatically with Google OAuth, or upload a custom image.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold cursor-pointer transition-colors">
                      <Camera className="h-3.5 w-3.5" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="Or paste image URL"
                      value={form.profileImage}
                      onChange={(e) => setForm({ ...form, profileImage: e.target.value })}
                      className="px-2.5 py-1 rounded-lg bg-background border border-border text-foreground text-xs flex-1 min-w-[180px] focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <form onSubmit={handlePersonalSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">First Name *</label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Registered Email</label>
                    <input
                      type="email"
                      disabled
                      value={profile?.email || ""}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-muted text-muted-foreground text-sm cursor-not-allowed border border-border"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 00000"
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Professional Bio / Executive Summary</label>
                  <textarea
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Introduce yourself to fellow chapter members, background, and career focus..."
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Personal Website</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Linkedin className="h-3.5 w-3.5 text-blue-500" />
                      <span>LinkedIn Profile</span>
                    </label>
                    <input
                      type="text"
                      placeholder="linkedin.com/in/..."
                      value={form.linkedin}
                      onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Twitter className="h-3.5 w-3.5 text-sky-400" />
                      <span>Twitter / X</span>
                    </label>
                    <input
                      type="text"
                      placeholder="@handle"
                      value={form.twitter}
                      onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end pt-3 border-t border-border">
                  <button
                    type="submit"
                    disabled={submittingPersonal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    <span>{submittingPersonal ? "Saving..." : "Save Personal Details"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Side Card: Structured ID Badge & Password Reset */}
            <div className="space-y-5">
              {/* Structured Membership Badge Card */}
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 text-center">
                <Avatar className="h-20 w-20 mx-auto rounded-full border-2 border-primary/30 shadow-md">
                  <AvatarImage src={form.profileImage || undefined} alt={form.firstName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                    {form.firstName[0] || "M"}{form.lastName[0] || ""}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-base text-foreground">
                    {form.firstName} {form.lastName}
                  </h4>
                  <p className="text-xs text-muted-foreground">{profile?.chapterName || "Growcle Chapter"}</p>
                </div>

                <div className="bg-muted/40 rounded-lg p-3 text-xs space-y-2 text-left border border-border/50">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Member ID:</span>
                    <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-[11px]">
                      {profile?.membershipNumber || "GRC-AUTO-GEN"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> Active Member
                    </span>
                  </div>
                </div>
              </div>

              {/* Password Reset Card */}
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-sm text-foreground">Password & Security</h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  Send a password reset verification link to your registered email address.
                </p>
                {resetStatus && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400">
                    {resetStatus}
                  </div>
                )}
                <button
                  type="button"
                  disabled={isResetting}
                  onClick={handlePasswordReset}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold border border-border transition-colors cursor-pointer"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>{isResetting ? "Sending Link..." : "Send Password Reset Link"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section: Business Networking Profile (Merged into Profile Hub) */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-bold text-base text-foreground">Business Networking Portfolio</h3>
                  <p className="text-xs text-muted-foreground">
                    Define what you do, who you help, and your referral parameters for fellow chapter members.
                  </p>
                </div>
              </div>
              {savedBizSuccess && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Portfolio Saved
                </span>
              )}
            </div>

            <form onSubmit={handleBusinessSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Business / Firm Name *</label>
                  <input
                    type="text"
                    required
                    value={bizForm.businessName}
                    onChange={(e) => setBizForm({ ...bizForm, businessName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Industry / Sector *</label>
                  <input
                    type="text"
                    required
                    value={bizForm.industry}
                    onChange={(e) => setBizForm({ ...bizForm, industry: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Category *</label>
                  <input
                    type="text"
                    placeholder="e.g. Digital Growth / Legal"
                    value={bizForm.businessCategory}
                    onChange={(e) => setBizForm({ ...bizForm, businessCategory: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Company Overview & Core Services</label>
                <textarea
                  rows={3}
                  value={bizForm.description}
                  onChange={(e) => setBizForm({ ...bizForm, description: e.target.value })}
                  placeholder="Describe your services, credentials, client results, and business capabilities..."
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-primary uppercase tracking-wider">What I Do</label>
                  <textarea
                    rows={3}
                    value={bizForm.whatIDo}
                    onChange={(e) => setBizForm({ ...bizForm, whatIDo: e.target.value })}
                    placeholder="Summarize your key products, solutions, or professional offerings..."
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Who I Help</label>
                  <textarea
                    rows={3}
                    value={bizForm.whoIHelp}
                    onChange={(e) => setBizForm({ ...bizForm, whoIHelp: e.target.value })}
                    placeholder="Target customer profiles, ideal client industries, and decision makers..."
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Target className="h-4 w-4" />
                    <span>Best Referral For Me</span>
                  </label>
                  <textarea
                    rows={2}
                    value={bizForm.bestReferral}
                    onChange={(e) => setBizForm({ ...bizForm, bestReferral: e.target.value })}
                    placeholder="e.g. Series-A startups seeking fractional CFO or corporate legal audit"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1.5 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                  <label className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <ThumbsDown className="h-4 w-4" />
                    <span>Not A Good Referral</span>
                  </label>
                  <textarea
                    rows={2}
                    value={bizForm.notAGoodReferral}
                    onChange={(e) => setBizForm({ ...bizForm, notAGoodReferral: e.target.value })}
                    placeholder="e.g. Free consultations or consumer retail products"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Office Address</label>
                  <input
                    type="text"
                    value={bizForm.businessAddress}
                    onChange={(e) => setBizForm({ ...bizForm, businessAddress: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Business Phone</label>
                  <input
                    type="tel"
                    value={bizForm.businessPhone}
                    onChange={(e) => setBizForm({ ...bizForm, businessPhone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Business Website</label>
                  <input
                    type="url"
                    value={bizForm.website}
                    onChange={(e) => setBizForm({ ...bizForm, website: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-border">
                <button
                  type="submit"
                  disabled={submittingBusiness}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>{submittingBusiness ? "Saving..." : "Save Business Portfolio"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
