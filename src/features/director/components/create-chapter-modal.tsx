"use client";

import React, { useState } from "react";
import { Building2, Check, ArrowRight, ArrowLeft, X } from "lucide-react";
import { createDirectorChapter } from "../actions/director-actions";

interface CreateChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateChapterModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateChapterModalProps) {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    chapterCode: "",
    region: "Northern California",
    meetingDay: "Wednesday",
    meetingTime: "07:30 AM",
    meetingLocation: "",
    description: "",
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && !formData.name) return;
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createDirectorChapter(formData);
      onSuccess?.();
      onClose();
      setStep(1);
    } catch (err) {
      console.error("Failed to create chapter", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl border bg-card p-6 shadow-xl space-y-5">
        {/* Header & Steps Indicator */}
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Create New Chapter (Step {step} of 4)
            </h3>
            <p className="text-xs text-muted-foreground">Establish a new chapter under your director scope</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Form Body based on Step */}
        <div className="space-y-4 text-sm min-h-[220px]">
          {step === 1 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Step 1 — Basic Information</h4>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Chapter Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Palo Alto Founders Club"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Chapter Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PAF-04"
                    value={formData.chapterCode}
                    onChange={(e) => setFormData({ ...formData, chapterCode: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Region
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Northern California"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Step 2 — Meeting Schedule & Location</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Meeting Day
                  </label>
                  <select
                    value={formData.meetingDay}
                    onChange={(e) => setFormData({ ...formData, meetingDay: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Meeting Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 07:30 AM"
                    value={formData.meetingTime}
                    onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Meeting Location / Venue
                </label>
                <input
                  type="text"
                  placeholder="e.g. Silicon Valley Golf Club & Conference Suite"
                  value={formData.meetingLocation}
                  onChange={(e) => setFormData({ ...formData, meetingLocation: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Step 3 — Leadership Workspace Setup</h4>
              <p className="text-xs text-muted-foreground">
                Upon creation, your new chapter will be initialized with vacant leadership positions for President, Vice President, and Treasurer. You can assign members to leadership positions anytime from the Leadership tab.
              </p>
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold">President:</span>
                  <span className="text-amber-500 font-medium">Unassigned (Pending creation)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Vice President:</span>
                  <span className="text-amber-500 font-medium">Unassigned (Pending creation)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Treasurer:</span>
                  <span className="text-amber-500 font-medium">Unassigned (Pending creation)</span>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Step 4 — Review & Confirm Creation</h4>
              <div className="rounded-lg border bg-muted/40 p-4 space-y-2 text-xs">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Chapter Name:</span>
                  <span className="font-bold text-foreground">{formData.name}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Chapter Code:</span>
                  <span className="font-semibold">{formData.chapterCode || "Auto-assigned"}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Region:</span>
                  <span className="font-medium">{formData.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Schedule:</span>
                  <span className="font-medium">{formData.meetingDay}s @ {formData.meetingTime}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-3 border-t">
          {step > 1 ? (
            <button
              onClick={handleBack}
              disabled={loading}
              className="rounded-md border px-3 py-1.5 text-xs font-semibold hover:bg-accent flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={!formData.name}
              className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1"
            >
              Next <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1"
            >
              <Check className="h-4 w-4" /> {loading ? "Establishing..." : "Establish Chapter"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
