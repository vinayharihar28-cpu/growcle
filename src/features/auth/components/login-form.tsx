"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMsg(null);
      const { data: authData, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/dashboard",
      });
      if (error) {
        setErrorMsg(error.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Email sign in failed", error);
      setErrorMsg("An unexpected error occurred. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("Google sign in failed", error);
    }
  };


  return (
    <Card className="bg-slate-900/50 border-slate-800/80 backdrop-blur-xl shadow-2xl rounded-2xl p-4 sm:p-8">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-indigo-100 to-white">
          Sign in
        </CardTitle>
        <CardDescription className="text-center text-slate-400">
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-300 font-medium">Password</Label>
              <Link href="/forgot-password" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              {...register("password")} 
              className="bg-slate-950/50 border-slate-800/80 text-slate-100 focus-visible:ring-indigo-600 focus-visible:ring-offset-slate-900 h-11 rounded-xl"
            />
            {errors.password && <p className="text-xs text-rose-500 font-medium">{errors.password.message}</p>}
          </div>

          {errorMsg && (
            <div className="p-3 text-sm font-medium bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
              {errorMsg}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-11 transition-all rounded-xl shadow-lg hover:shadow-indigo-500/25 shadow-indigo-600/10 cursor-pointer" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0b101f] border border-slate-800/80 px-3 py-1 rounded-full text-slate-400 text-[10px] tracking-wider font-semibold">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-slate-800/85 hover:bg-slate-800/50 text-slate-300 hover:text-white font-semibold h-11 transition-all rounded-xl cursor-pointer"
            onClick={handleGoogleLogin}
          >
            <svg className="mr-2.5 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Google
          </Button>


          <div className="text-center text-sm text-slate-400 pt-2">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>

  );
}

