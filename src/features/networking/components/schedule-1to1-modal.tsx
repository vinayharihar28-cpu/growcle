"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { logOneToOne } from "../actions/one-to-ones";
import { getMembers } from "@/features/members/actions/members";
import { useAuthStore } from "@/shared/stores/auth";
import { X, Users2, CheckCircle2, AlertCircle } from "lucide-react";

const oneToOneSchema = z.object({
  receiverId: z.string().min(1, "Please select a member for the 1-to-1"),
  date: z.string().min(1, "Please select date & time"),
  notes: z.string().optional(),
});

type OneToOneFormData = z.infer<typeof oneToOneSchema>;

interface ScheduleOneToOneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ScheduleOneToOneModal({ isOpen, onClose, onSuccess }: ScheduleOneToOneModalProps) {
  const { currentMember } = useAuthStore();
  const [members, setMembers] = React.useState<any[]>([]);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<OneToOneFormData>({
    resolver: zodResolver(oneToOneSchema),
    defaultValues: {
      receiverId: "",
      date: new Date().toISOString().slice(0, 16),
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

  const onSubmit = async (data: OneToOneFormData) => {
    if (!currentMember?.id) {
      setErrorMsg("Member identity not loaded.");
      return;
    }

    try {
      setErrorMsg("");
      await logOneToOne({
        initiatorId: currentMember.id,
        receiverId: data.receiverId,
        date: new Date(data.date),
        notes: data.notes,
      });

      setSubmitSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to schedule 1-to-1.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-background border border-border shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center gap-2 text-primary font-bold text-base">
            <Users2 className="h-5 w-5" />
            <span>Schedule / Log 1-to-1 Meeting</span>
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
              <h3 className="text-xl font-bold text-foreground">1-to-1 Logged Successfully!</h3>
              <p className="text-xs text-muted-foreground">Your networking activity score has been updated.</p>
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
                <Label htmlFor="receiverId" className="text-xs font-semibold">Select Member</Label>
                <select
                  id="receiverId"
                  {...register("receiverId")}
                  className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-10"
                >
                  <option value="">Choose member to meet with...</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} {m.business?.businessName ? `(${m.business.businessName})` : ""}
                    </option>
                  ))}
                </select>
                {errors.receiverId && <p className="text-[11px] text-rose-500 font-medium">{errors.receiverId.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-xs font-semibold">Meeting Date & Time</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  {...register("date")}
                  className="h-10 rounded-xl"
                />
                {errors.date && <p className="text-[11px] text-rose-500 font-medium">{errors.date.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs font-semibold">Discussion Topics & Notes</Label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Key topics discussed, target clients identified..."
                  {...register("notes")}
                  className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-primary text-primary-foreground">
                  {isSubmitting ? "Saving..." : "Log 1-to-1"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
