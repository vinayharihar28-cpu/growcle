"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { updateReferralStatus } from "../actions/referrals";
import { X, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { ReferralStatus } from "@prisma/client";

interface UpdateReferralStatusModalProps {
  referral: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UpdateReferralStatusModal({
  referral,
  isOpen,
  onClose,
  onSuccess,
}: UpdateReferralStatusModalProps) {
  const [status, setStatus] = React.useState<ReferralStatus>("PENDING");
  const [value, setValue] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  React.useEffect(() => {
    if (referral) {
      setStatus(referral.status || "PENDING");
      setValue(referral.value ? referral.value.toString() : "");
      setErrorMsg("");
    }
  }, [referral]);

  if (!isOpen || !referral) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const numericVal = value ? parseFloat(value) : undefined;
      const res = await updateReferralStatus(referral.id, status, numericVal);

      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setErrorMsg(res.error || "Failed to update referral status.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-background border border-border shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center gap-2 text-primary font-bold text-base">
            <RefreshCw className="h-4 w-4" />
            <span>Update Referral Status</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Referral</p>
            <p className="text-base font-bold text-foreground">{referral.referralName}</p>
            <p className="text-xs text-muted-foreground">
              From: {referral.fromMember ? `${referral.fromMember.firstName} ${referral.fromMember.lastName}` : "Member"}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-xs font-semibold">Current Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ReferralStatus)}
              className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-10 font-semibold"
            >
              <option value="PENDING">Pending (Warm Lead)</option>
              <option value="CONTACTED">Contacted / In Progress</option>
              <option value="CLOSED_WON">Closed Won (Revenue Generated)</option>
              <option value="CLOSED_LOST">Closed Lost</option>
            </select>
          </div>

          {(status === "CLOSED_WON" || status === "CONTACTED") && (
            <div className="space-y-1.5 animate-in fade-in">
              <Label htmlFor="value" className="text-xs font-semibold">Closed Business / Contract Value ($)</Label>
              <Input
                id="value"
                type="number"
                placeholder="e.g. 12500"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="h-10 rounded-xl"
              />
              <p className="text-[11px] text-muted-foreground">
                Logging closed revenue updates your chapter ROI and Thank-You-For-Closed-Business (TYFCB) score.
              </p>
            </div>
          )}

          <div className="pt-3 flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="rounded-xl bg-primary text-primary-foreground">
              {loading ? "Updating..." : "Save Status"}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
