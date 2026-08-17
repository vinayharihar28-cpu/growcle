"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { createReferral } from "../actions/referrals";
import { getMembers } from "@/features/members/actions/members";
import { useAuthStore } from "@/shared/stores/auth";
import { X, Handshake, CheckCircle2, AlertCircle } from "lucide-react";

const referralSchema = z.object({
  toMemberId: z.string().min(1, "Please select a member to pass referral to"),
  referralName: z.string().min(2, "Referral name is required"),
  referralEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  referralPhone: z.string().optional(),
  category: z.string().optional(),
  value: z.string().optional(),
  notes: z.string().optional(),
});

type ReferralFormData = z.infer<typeof referralSchema>;

interface LogReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LogReferralModal({ isOpen, onClose, onSuccess }: LogReferralModalProps) {
  const { currentMember } = useAuthStore();
  const [members, setMembers] = React.useState<any[]>([]);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ReferralFormData>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      toMemberId: "",
      referralName: "",
      referralEmail: "",
      referralPhone: "",
      category: "Tier 1 - Inside",
      value: "",
      notes: "",
    }
  });

  React.useEffect(() => {
    if (isOpen) {
      getMembers().then((list) => {
        setMembers(list.filter((m) => m.id !== currentMember?.id));
      });
      setSubmitSuccess(false);
      setErrorMsg("");
      reset();
    }
  }, [isOpen, currentMember?.id, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: ReferralFormData) => {
    if (!currentMember?.id || !currentMember?.chapterId) {
      setErrorMsg("Member identity not loaded. Please re-login.");
      return;
    }

    try {
      setErrorMsg("");
      const res = await createReferral({
        fromMemberId: currentMember.id,
        toMemberId: data.toMemberId,
        chapterId: currentMember.chapterId,
        referralName: data.referralName,
        referralEmail: data.referralEmail,
        referralPhone: data.referralPhone,
        category: data.category,
        value: data.value,
        notes: data.notes,
      });

      if (res.success) {
        setSubmitSuccess(true);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMsg(res.error || "Failed to log referral.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-background border border-border shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center gap-2 text-primary font-bold text-base">
            <Handshake className="h-5 w-5" />
            <span>Log New Referral</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitSuccess ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-bold text-foreground">Referral Passed Successfully!</h3>
              <p className="text-xs text-muted-foreground">The member has been notified of this business opportunity.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errorMsg && (
                <div className="p-3 text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="toMemberId" className="text-xs font-semibold">Pass Referral To Member</Label>
                <select
                  id="toMemberId"
                  {...register("toMemberId")}
                  className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-10"
                >
                  <option value="">Select chapter member...</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} {m.business?.businessName ? `(${m.business.businessName})` : ""}
                    </option>
                  ))}
                </select>
                {errors.toMemberId && <p className="text-[11px] text-rose-500 font-medium">{errors.toMemberId.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="referralName" className="text-xs font-semibold">Prospect / Referral Name</Label>
                <Input
                  id="referralName"
                  placeholder="e.g. Acme Corp / Robert Fox"
                  {...register("referralName")}
                  className="h-10 rounded-xl"
                />
                {errors.referralName && <p className="text-[11px] text-rose-500 font-medium">{errors.referralName.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="referralEmail" className="text-xs font-semibold">Prospect Email (Optional)</Label>
                  <Input
                    id="referralEmail"
                    type="email"
                    placeholder="robert@example.com"
                    {...register("referralEmail")}
                    className="h-10 rounded-xl"
                  />
                  {errors.referralEmail && <p className="text-[11px] text-rose-500 font-medium">{errors.referralEmail.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="referralPhone" className="text-xs font-semibold">Prospect Phone (Optional)</Label>
                  <Input
                    id="referralPhone"
                    placeholder="+1 (555) 019-2834"
                    {...register("referralPhone")}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-xs font-semibold">Referral Category</Label>
                  <select
                    id="category"
                    {...register("category")}
                    className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-10"
                  >
                    <option value="Tier 1 - Inside">Tier 1 - Inside (Member self)</option>
                    <option value="Tier 2 - Outside">Tier 2 - Outside (Friend/Client)</option>
                    <option value="Tier 3 - Introduction">Tier 3 - Warm Introduction</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="value" className="text-xs font-semibold">Estimated Value ($)</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="e.g. 5000"
                    {...register("value")}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs font-semibold">Notes & Context</Label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Provide background context for the member..."
                  {...register("notes")}
                  className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-primary text-primary-foreground">
                  {isSubmitting ? "Logging..." : "Submit Referral"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
