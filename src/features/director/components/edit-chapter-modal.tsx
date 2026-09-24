"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  X,
  Save,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  Palette,
  Power,
  FileText,
} from "lucide-react";
import { updateChapterDetails } from "../actions/director-actions";
import { CHAPTER_THEMES } from "@/lib/chapter-themes";

export interface EditChapterData {
  id: string;
  name: string;
  chapterCode?: string;
  region?: string;
  location?: string;
  meetingLocation?: string;
  meetingDay?: string;
  meetingTime?: string;
  meetingFee?: number;
  upiId?: string;
  upiName?: string;
  themeColor?: string;
  description?: string;
  isActive?: boolean;
}

interface EditChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: EditChapterData | null;
  onSuccess?: () => void;
}

const THEME_OPTIONS = [
  { id: "emerald", label: "Emerald Green", bg: "bg-emerald-500" },
  { id: "indigo", label: "Indigo Royal", bg: "bg-indigo-500" },
  { id: "purple", label: "Purple Velvet", bg: "bg-purple-500" },
  { id: "amber", label: "Amber Gold", bg: "bg-amber-500" },
  { id: "rose", label: "Rose Crimson", bg: "bg-rose-500" },
  { id: "cyan", label: "Cyan Ocean", bg: "bg-cyan-500" },
  { id: "orange", label: "Sunset Orange", bg: "bg-orange-500" },
];

const MEETING_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function EditChapterModal({
  isOpen,
  onClose,
  chapter,
  onSuccess,
}: EditChapterModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    chapterCode: "",
    region: "",
    location: "",
    meetingDay: "Wednesday",
    meetingTime: "07:30 AM",
    meetingFee: 800,
    upiId: "",
    upiName: "",
    themeColor: "emerald",
    description: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (chapter) {
      setFormData({
        name: chapter.name || "",
        chapterCode: chapter.chapterCode || "",
        region: chapter.region || "",
        location: chapter.meetingLocation || chapter.location || "",
        meetingDay: chapter.meetingDay || "Wednesday",
        meetingTime: chapter.meetingTime || "07:30 AM",
        meetingFee: chapter.meetingFee ?? 800,
        upiId: chapter.upiId || "",
        upiName: chapter.upiName || "",
        themeColor: chapter.themeColor || "emerald",
        description: chapter.description || "",
        isActive: chapter.isActive !== undefined ? chapter.isActive : true,
      });
      setError(null);
      setSuccess(false);
    }
  }, [chapter, isOpen]);

  if (!isOpen || !chapter) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Chapter name is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateChapterDetails({
        chapterId: chapter.id,
        name: formData.name,
        chapterCode: formData.chapterCode,
        region: formData.region,
        meetingLocation: formData.location,
        meetingDay: formData.meetingDay,
        meetingTime: formData.meetingTime,
        meetingFee: Number(formData.meetingFee),
        upiId: formData.upiId,
        upiName: formData.upiName,
        themeColor: formData.themeColor,
        description: formData.description,
        isActive: formData.isActive,
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err?.message || "Failed to update chapter details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Edit Chapter Details</h3>
              <p className="text-xs text-muted-foreground">
                Update chapter identity, schedule, venue, fees, and theme branding.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Chapter details updated successfully!</span>
              </div>
            )}

            {/* Section 1: Basic Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 text-primary" /> Identity & Code
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Chapter Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Apex Central Chapter"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Chapter Code</label>
                  <input
                    type="text"
                    value={formData.chapterCode}
                    onChange={(e) => setFormData({ ...formData, chapterCode: e.target.value })}
                    placeholder="e.g. APX-01"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Region / Territory</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="e.g. Bangalore Central"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Meeting Venue / Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Hotel Krishna Vaibhava"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-xs font-semibold text-foreground">Description / Notes</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short overview of chapter specialization or membership focus..."
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Section 2: Meeting Logistics */}
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Meeting Schedule & Fees
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Regular Meeting Day</label>
                  <select
                    value={formData.meetingDay}
                    onChange={(e) => setFormData({ ...formData, meetingDay: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {MEETING_DAYS.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Meeting Time</label>
                  <input
                    type="text"
                    value={formData.meetingTime}
                    onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
                    placeholder="07:30 AM"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Meeting Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={formData.meetingFee}
                    onChange={(e) => setFormData({ ...formData, meetingFee: Number(e.target.value) })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Treasury & UPI */}
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <IndianRupee className="h-3.5 w-3.5 text-primary" /> Chapter UPI Collection
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">UPI VPA ID</label>
                  <input
                    type="text"
                    value={formData.upiId}
                    onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                    placeholder="e.g. chapter@okaxis"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Payee Name</label>
                  <input
                    type="text"
                    value={formData.upiName}
                    onChange={(e) => setFormData({ ...formData, upiName: e.target.value })}
                    placeholder="e.g. Chapter Treasury Account"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Theme Color Branding */}
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Palette className="h-3.5 w-3.5 text-primary" /> Branding Accent Theme
              </div>
              <div className="flex flex-wrap gap-2.5">
                {THEME_OPTIONS.map((color) => {
                  const isSelected = formData.themeColor === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, themeColor: color.id })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/20 bg-primary/5 font-bold shadow-xs"
                          : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${color.bg}`} />
                      {color.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 5: Status Toggle */}
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center justify-between p-3.5 rounded-xl border bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${formData.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
                    <Power className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Chapter Operating Status</h5>
                    <p className="text-[11px] text-muted-foreground">
                      {formData.isActive
                        ? "Active: Members can schedule meetings, mark attendance, and exchange referrals."
                        : "Inactive: Chapter operations are paused."}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    formData.isActive
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                      : "bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500/20"
                  }`}
                >
                  {formData.isActive ? "ACTIVE" : "INACTIVE"}
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t px-6 py-4 bg-muted/20">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-input bg-background px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-xs"
            >
              <Save className="h-4 w-4" />
              {loading ? "Saving Changes..." : "Save Chapter Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
