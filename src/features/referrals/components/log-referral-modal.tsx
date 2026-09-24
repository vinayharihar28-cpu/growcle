"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { createReferral } from "../actions/referrals";
import { getMembers } from "@/features/members/actions/members";
import { useAuthStore } from "@/shared/stores/auth";
import { X, Handshake, CheckCircle2, AlertCircle, Smartphone, BookUser, Info } from "lucide-react";
import { useContactPicker, PickedContact } from "@/shared/hooks/use-contact-picker";

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
  const [contactNotice, setContactNotice] = React.useState<string | null>(null);

  // Direct Contact Picker Hook (Native phonebook)
  const { pickContact } = useContactPicker();

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ReferralFormData>({
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

  const handleSelectContact = (contact: PickedContact) => {
    if (contact.name) setValue("referralName", contact.name, { shouldValidate: true });
    if (contact.phone) setValue("referralPhone", contact.phone, { shouldValidate: true });
    if (contact.email) setValue("referralEmail", contact.email, { shouldValidate: true });
  };

  const handleOpenContactPicker = async () => {
    setContactNotice(null);
    try {
      const res = await pickContact();
      if (res?.contact) {
        handleSelectContact(res.contact);
      } else if (res?.error === "NOT_SUPPORTED") {
        setContactNotice("Device contact picker is available on mobile devices (Chrome on Android). Please type contact details directly below.");
        setTimeout(() => setContactNotice(null), 6000);
      }
    } catch (err) {
      console.warn("[ContactPicker] Error picking contact:", err);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      getMembers().then((list) => {
        setMembers(list.filter((m) => m.id !== currentMember?.id));
      });
      setSubmitSuccess(false);
      setErrorMsg("");
      setContactNotice(null);
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
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-background border border-border shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-background/95 backdrop-blur-sm">
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
                <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-destructive/10 text-destructive border border-destructive/20 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* To Member */}
              <div className="space-y-1.5">
                <Label htmlFor="toMemberId" className="text-xs font-semibold flex items-center gap-1">
                  <span>Pass Referral To</span>
                  <span className="text-rose-500">*</span>
                </Label>
                <select
                  id="toMemberId"
                  {...register("toMemberId")}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                >
                  <option value="">Select Chapter Member...</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} {m.business?.businessName ? `(${m.business.businessName})` : ""}
                    </option>
                  ))}
                </select>
                {errors.toMemberId && <p className="text-[11px] text-rose-500 font-medium">{errors.toMemberId.message}</p>}
              </div>

              {/* Contact Picker Trigger Banner - Direct Device Contacts */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <BookUser className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Select Prospect Contact</p>
                      <p className="text-[11px] text-muted-foreground">Pick directly from phonebook to auto-fill</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenContactPicker}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors shadow-xs cursor-pointer shrink-0"
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>Choose Contact</span>
                  </button>
                </div>
                {contactNotice && (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-400 animate-in fade-in">
                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span>{contactNotice}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="referralName" className="text-xs font-semibold flex items-center gap-1">
                  <span>Prospect / Referral Name</span>
                  <span className="text-rose-500">*</span>
                </Label>
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
                    placeholder="prospect@company.com"
                    {...register("referralEmail")}
                    className="h-10 rounded-xl"
                  />
                  {errors.referralEmail && <p className="text-[11px] text-rose-500 font-medium">{errors.referralEmail.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="referralPhone" className="text-xs font-semibold">Prospect Phone (Optional)</Label>
                  <Input
                    id="referralPhone"
                    type="tel"
                    placeholder="+91 98765 00000"
                    {...register("referralPhone")}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-xs font-semibold">Referral Tier</Label>
                  <select
                    id="category"
                    {...register("category")}
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  >
                    <option value="Tier 1 - Inside">Tier 1 - Inside (Member Themselves)</option>
                    <option value="Tier 2 - Outside">Tier 2 - Outside (Direct Connection)</option>
                    <option value="Tier 3 - Synergy">Tier 3 - Synergy Partner</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="value" className="text-xs font-semibold">Est. Deal Value (₹)</Label>
                  <Input
                    id="value"
                    placeholder="e.g. 50000"
                    {...register("value")}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs font-semibold">Requirement Details / Comments</Label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Describe the prospect's needs, timing, or how you initiated the introduction..."
                  {...register("notes")}
                  className="w-full p-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
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
