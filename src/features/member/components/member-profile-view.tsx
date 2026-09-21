"use client";

import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Globe, Linkedin, Twitter, Save, CheckCircle2, ShieldCheck } from "lucide-react";
import {
  getMemberContext,
  getMemberProfile,
  updateMemberProfile,
  MemberContext,
} from "../actions/member-actions";
import { MemberHeaderBar } from "./member-header-bar";

export function MemberProfileView() {
  const [context, setContext] = useState<MemberContext | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    website: "",
    linkedin: "",
    twitter: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getMemberContext();
      setContext(ctx);
      const p = await getMemberProfile(ctx.memberId);
      setProfile(p);
      setForm({
        firstName: p.firstName || "",
        lastName: p.lastName || "",
        phone: p.phone || "",
        bio: p.bio || "",
        website: p.website || "",
        linkedin: p.linkedin || "",
        twitter: p.twitter || "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context) return;
    setSubmitting(true);
    try {
      await updateMemberProfile(context.memberId, {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phone,
        bio: form.bio,
        website: form.website,
        linkedin: form.linkedin,
        twitter: form.twitter,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {context && <MemberHeaderBar context={context} />}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Personal Profile</h2>
          <p className="text-sm text-muted-foreground">
            Manage your personal identity, contact channels, and networking bio.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          Loading personal profile...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Edit Form */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Edit Personal Details</h3>
              </div>
              {savedSuccess && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Changes Saved
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  <p className="text-[11px] text-muted-foreground mt-0.5">Contact chapter leadership to change.</p>
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
                  rows={4}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Introduce yourself to fellow chapter members, background, and passion..."
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
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{submitting ? "Saving..." : "Save Profile"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Membership Badge Sidebar Card */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 text-center">
              <div className="h-20 w-20 mx-auto rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-2xl">
                {form.firstName[0] || "M"}
                {form.lastName[0] || ""}
              </div>
              <div>
                <h4 className="font-bold text-base text-foreground">
                  {form.firstName} {form.lastName}
                </h4>
                <p className="text-xs text-muted-foreground">{profile?.chapterName}</p>
              </div>

              <div className="bg-muted/40 rounded-lg p-3 text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Membership ID:</span>
                  <span className="font-mono font-semibold text-foreground">{profile?.membershipNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-emerald-500 font-semibold">Active Member</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
