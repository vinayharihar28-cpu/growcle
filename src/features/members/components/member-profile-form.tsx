"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useAuthStore } from "@/shared/stores/auth";
import { getMemberProfile, updateMemberProfile } from "../actions/members";
import { Building2, Globe, Link2, Mail, Phone, Upload, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  businessName: z.string().min(2, "Business name is required"),
  industry: z.string().optional(),
  companyDescription: z.string().optional(),
  businessAddress: z.string().optional(),
  businessPhone: z.string().optional(),
  businessEmail: z.string().optional(),
  businessCategory: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function MemberProfileForm() {
  const { currentMember } = useAuthStore();
  const [loading, setLoading] = React.useState(true);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  React.useEffect(() => {
    if (!currentMember?.id) return;
    async function load() {
      try {
        const data = await getMemberProfile(currentMember!.id);
        if (data) {
          reset({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            phoneNumber: data.phoneNumber || "",
            bio: data.bio || "",
            website: data.website || data.business?.website || "",
            linkedin: data.linkedin || "",
            twitter: data.twitter || "",
            instagram: data.instagram || "",
            businessName: data.business?.businessName || `${data.firstName}'s Enterprise`,
            industry: data.business?.industry || "",
            companyDescription: data.business?.companyDescription || "",
            businessAddress: data.business?.businessAddress || "",
            businessPhone: data.business?.businessPhone || "",
            businessEmail: data.business?.businessEmail || data.email || "",
            businessCategory: data.business?.businessCategory || "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentMember?.id, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!currentMember?.id) return;
    try {
      setErrorMsg("");
      setSaveSuccess(false);
      const res = await updateMemberProfile(currentMember.id, data);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setErrorMsg(res.error || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground font-semibold">Loading profile information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header banner */}
      <div className="flex items-center justify-between p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <ShieldCheck className="h-3.5 w-3.5" /> Required Permission: profile.edit (Owner)
          </div>
          <h2 className="text-2xl font-bold">Business Showcase & Member Profile</h2>
          <p className="text-xs text-slate-300">
            Highlight your company services, contact channels, and bio for fellow chapter members.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-5 w-5" /> Profile changes saved successfully!
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="h-5 w-5" /> {errorMsg}
          </div>
        )}

        {/* 1. Personal & Contact Info Card */}
        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-500" /> Member Info & Contact Channels
            </CardTitle>
            <CardDescription className="text-xs">Your personal identity inside the chapter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-semibold">First Name</Label>
                <Input id="firstName" {...register("firstName")} className="h-10 rounded-xl" />
                {errors.firstName && <p className="text-[11px] text-rose-500 font-medium">{errors.firstName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-semibold">Last Name</Label>
                <Input id="lastName" {...register("lastName")} className="h-10 rounded-xl" />
                {errors.lastName && <p className="text-[11px] text-rose-500 font-medium">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phoneNumber" className="text-xs font-semibold">Direct Phone Number</Label>
                <Input id="phoneNumber" placeholder="+1 (555) 234-5678" {...register("phoneNumber")} className="h-10 rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="businessEmail" className="text-xs font-semibold">Business Email</Label>
                <Input id="businessEmail" type="email" placeholder="contact@company.com" {...register("businessEmail")} className="h-10 rounded-xl" />
              </div>
            </div>

          </CardContent>
        </Card>

        {/* 2. Business Profile Showcase Card */}
        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-500" /> Company Showcase & Services
            </CardTitle>
            <CardDescription className="text-xs">Promote your products, services, and ideal referral targets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="businessName" className="text-xs font-semibold">Company / Business Name</Label>
                <Input id="businessName" placeholder="Acme Financial Group" {...register("businessName")} className="h-10 rounded-xl" />
                {errors.businessName && <p className="text-[11px] text-rose-500 font-medium">{errors.businessName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="industry" className="text-xs font-semibold">Industry Sector</Label>
                <Input id="industry" placeholder="Commercial Real Estate / Legal" {...register("industry")} className="h-10 rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="businessCategory" className="text-xs font-semibold">Chapter Business Category</Label>
                <Input id="businessCategory" placeholder="Residential Mortgage Broker" {...register("businessCategory")} className="h-10 rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="website" className="text-xs font-semibold">Company Website URL</Label>
                <Input id="website" placeholder="https://www.example.com" {...register("website")} className="h-10 rounded-xl" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="companyDescription" className="text-xs font-semibold">Company Description & Bio (Rich Showcase)</Label>
              <textarea
                id="companyDescription"
                rows={4}
                placeholder="Describe your target clients, key offerings, and value proposition..."
                {...register("companyDescription")}
                className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="businessAddress" className="text-xs font-semibold">Office Address</Label>
              <Input id="businessAddress" placeholder="100 Main St, Suite 200, City, State" {...register("businessAddress")} className="h-10 rounded-xl" />
            </div>

          </CardContent>
        </Card>

        {/* 3. Social Media & Logo Upload Card */}
        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Upload className="h-4 w-4 text-indigo-500" /> Social Links & Brand Assets
            </CardTitle>
            <CardDescription className="text-xs">Connect your social profiles and company logo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="linkedin" className="text-xs font-semibold flex items-center gap-1.5">
                  <Link2 className="h-3.5 w-3.5 text-blue-500" /> LinkedIn Profile
                </Label>
                <Input id="linkedin" placeholder="https://linkedin.com/in/..." {...register("linkedin")} className="h-10 rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="twitter" className="text-xs font-semibold flex items-center gap-1.5">
                  <Link2 className="h-3.5 w-3.5 text-sky-400" /> Twitter / X Profile
                </Label>
                <Input id="twitter" placeholder="https://x.com/..." {...register("twitter")} className="h-10 rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="instagram" className="text-xs font-semibold flex items-center gap-1.5">
                  <Link2 className="h-3.5 w-3.5 text-pink-500" /> Instagram Profile
                </Label>
                <Input id="instagram" placeholder="https://instagram.com/..." {...register("instagram")} className="h-10 rounded-xl" />
              </div>
            </div>

            {/* Logo Upload Placeholder */}
            <div className="p-6 border-2 border-dashed border-border/80 rounded-2xl bg-muted/20 text-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-xs font-semibold text-foreground">Upload Business Logo</p>
              <p className="text-[11px] text-muted-foreground">PNG, JPG or SVG (Max 2MB)</p>
              <Button type="button" variant="outline" size="sm" className="rounded-xl text-xs mt-1">
                Choose File
              </Button>
            </div>

          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="px-8 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-2xl shadow-lg transition-all"
          >
            {isSubmitting ? "Saving Profile..." : "Save Business Profile"}
          </Button>
        </div>

      </form>
    </div>
  );
}
