"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getChapters } from "@/features/chapter/actions/chapter";
import { createVisitor } from "@/features/visitors/actions/visitors";
import { AlertCircle, CheckCircle2, UserCheck, ArrowRight } from "lucide-react";

const visitorSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  businessName: z.string().optional(),
  industry: z.string().optional(),
  chapterId: z.string().min(1, "Please select a chapter to visit"),
  visitDate: z.string().min(1, "Please select a visit date"),
});

type VisitorFormData = z.infer<typeof visitorSchema>;

interface ChapterOption {
  id: string;
  name: string;
  organization: {
    name: string;
  } | null;
}

export function RegisterForm() {
  const [chapters, setChapters] = useState<ChapterOption[]>([]);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<VisitorFormData>({
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      businessName: "",
      industry: "",
      chapterId: "",
      visitDate: "",
    }
  });

  useEffect(() => {
    async function loadChapters() {
      try {
        const list = await getChapters();
        setChapters(list);
      } catch (err) {
        console.error("Failed to load chapters:", err);
      }
    }
    loadChapters();
  }, []);

  const onSubmit = async (data: VisitorFormData) => {
    try {
      setSubmitError("");
      await createVisitor(data);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setSubmitError("Failed to register visitor. Please try again.");
      triggerShake();
    }
  };

  const onError = () => {
    triggerShake();
  };

  return (
    <div className={`w-full rounded-3xl bg-card/90 dark:bg-card/75 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 lg:p-9 shadow-xl backdrop-blur-xl transition-all ${isShaking ? "animate-shake" : ""}`}>
      {/* Form Header */}
      <div className="space-y-1.5 pb-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-1">
          <UserCheck className="h-3.5 w-3.5" />
          <span>Chapter Visitor Registration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Register as Visitor
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Connect with business leaders and attend an upcoming weekly meeting.
        </p>
      </div>

      {success ? (
        <div className="space-y-5 text-center animate-in fade-in zoom-in duration-300 py-6">
          <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">Registration Submitted!</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Thank you! Your visitor registration request has been received. The chapter leadership team will reach out shortly with meeting details.
            </p>
          </div>
          <div className="pt-3">
            <Link 
              href="/" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all shadow-md text-sm"
            >
              <span>Return to Home</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-3.5">
          {submitError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold text-center flex items-center justify-center gap-2 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}
          
          {/* Row 1: First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-xs font-semibold text-foreground/90">
                First Name <span className="text-rose-500">*</span>
              </Label>
              <Input 
                id="firstName" 
                placeholder="John" 
                {...register("firstName")} 
                className={`h-11 px-3.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-background/90 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all ${errors.firstName ? "border-rose-500" : ""}`}
              />
              {errors.firstName && <p className="text-[11px] text-rose-500 font-medium">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-xs font-semibold text-foreground/90">
                Last Name <span className="text-rose-500">*</span>
              </Label>
              <Input 
                id="lastName" 
                placeholder="Doe" 
                {...register("lastName")} 
                className={`h-11 px-3.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-background/90 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all ${errors.lastName ? "border-rose-500" : ""}`}
              />
              {errors.lastName && <p className="text-[11px] text-rose-500 font-medium">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Row 2: Work Email & Company Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-semibold text-foreground/90">
                Work Email <span className="text-rose-500">*</span>
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@company.com" 
                {...register("email")} 
                className={`h-11 px-3.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-background/90 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all ${errors.email ? "border-rose-500" : ""}`}
              />
              {errors.email && <p className="text-[11px] text-rose-500 font-medium">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="businessName" className="text-xs font-semibold text-foreground/90">
                Company Name <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Input 
                id="businessName" 
                placeholder="Acme Corp" 
                {...register("businessName")} 
                className="h-11 px-3.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-background/90 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
              />
            </div>
          </div>

          {/* Row 3: Select Chapter & Industry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <Label htmlFor="chapterId" className="text-xs font-semibold text-foreground/90">
                Select Chapter <span className="text-rose-500">*</span>
              </Label>
              <select 
                id="chapterId"
                {...register("chapterId")}
                className={`flex w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-background/90 px-3.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary h-11 transition-all ${errors.chapterId ? "border-rose-500" : ""}`}
              >
                <option value="" className="bg-background text-muted-foreground">Choose a chapter...</option>
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id} className="bg-background text-foreground">
                    {ch.name} {ch.organization ? `(${ch.organization.name})` : ""}
                  </option>
                ))}
              </select>
              {errors.chapterId && <p className="text-[11px] text-rose-500 font-medium">{errors.chapterId.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="industry" className="text-xs font-semibold text-foreground/90">
                Industry <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Input 
                id="industry" 
                placeholder="Real Estate / Tech / Legal" 
                {...register("industry")} 
                className="h-11 px-3.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-background/90 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
              />
            </div>
          </div>

          {/* Row 4: Planned Visit Date */}
          <div className="space-y-1">
            <Label htmlFor="visitDate" className="text-xs font-semibold text-foreground/90">
              Planned Visit Date <span className="text-rose-500">*</span>
            </Label>
            <Input 
              id="visitDate" 
              type="date" 
              {...register("visitDate")} 
              className={`h-11 px-3.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-background/90 text-foreground focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary block w-full transition-all ${errors.visitDate ? "border-rose-500" : ""}`}
            />
            {errors.visitDate && <p className="text-[11px] text-rose-500 font-medium">{errors.visitDate.message}</p>}
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 text-sm sm:text-base transition-all rounded-xl shadow-md hover:shadow-primary/20 cursor-pointer mt-2" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting Registration..." : "Complete Visitor Registration"}
          </Button>

          {/* Link to Login */}
          <div className="text-center text-xs text-muted-foreground pt-1">
            Already a registered member?{" "}
            <Link href="/login" className="text-primary hover:underline font-semibold transition-colors">
              Sign in to Portal
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
