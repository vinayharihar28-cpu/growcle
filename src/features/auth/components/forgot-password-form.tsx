"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: "/reset-password",
      });
      setSuccess(true);
    } catch (error) {
      console.error("Forgot password failed", error);
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800/80 backdrop-blur-xl shadow-2xl rounded-2xl p-4 sm:p-8">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-indigo-100 to-white">
          Forgot password
        </CardTitle>
        <CardDescription className="text-center text-slate-400">
          Enter your email address and we will send you a reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-sm">
              We&apos;ve sent a password reset link to your email address. Please check your inbox.
            </div>
            <Link 
              href="/login" 
              className="inline-block px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-md text-sm"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 font-medium">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                {...register("email")} 
                className="bg-slate-950/50 border-slate-800/80 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-600 focus-visible:ring-offset-slate-900 h-11 rounded-xl"
              />
              {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-11 transition-all rounded-xl shadow-lg hover:shadow-indigo-500/25 shadow-indigo-600/10 cursor-pointer" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </Button>
            <div className="text-center text-sm text-slate-400 pt-2">
              Remember your password?{" "}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Sign in
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

