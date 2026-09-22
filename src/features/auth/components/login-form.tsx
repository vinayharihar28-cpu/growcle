"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail 
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isShaking, setIsShaking] = React.useState(false);

  const oauthError = searchParams?.get("error");
  const errorDescription = searchParams?.get("error_description");

  React.useEffect(() => {
    if (oauthError) {
      if (
        oauthError.includes("UNREGISTERED") || 
        oauthError.includes("validation_failed") || 
        oauthError.includes("FORBIDDEN") || 
        oauthError.includes("access_denied")
      ) {
        setErrorMsg(
          "Access Denied: This Google account is not registered as a member in our database. Only pre-registered members can sign in. Please contact your Chapter Administrator."
        );
      } else if (oauthError.includes("SUSPENDED")) {
        setErrorMsg("Access Denied: Your chapter membership is currently suspended or expired. Please contact support.");
      } else {
        setErrorMsg(errorDescription || `Authentication error: ${oauthError}`);
      }
      triggerShake();
    }
  }, [oauthError, errorDescription]);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMsg(null);
      const email = data.email.trim();
      const { error } = await authClient.signIn.email({
        email,
        password: data.password,
        callbackURL: "/dashboard",
      });
      
      if (error) {
        if (
          error.message?.includes("Access Denied") || 
          error.message?.includes("UNREGISTERED") || 
          error.message?.includes("not registered")
        ) {
          setErrorMsg("Access Denied: Your email is not registered as an active member in the database. Please contact your Chapter Administrator.");
        } else {
          setErrorMsg(error.message || "Invalid email or password. Please verify your credentials.");
        }
        triggerShake();
      } else {
        // The session cookie is available on the next request, so a single
        // navigation is enough. Refreshing here caused duplicate dashboard loads.
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Email sign in failed", error);
      setErrorMsg("An unexpected network error occurred. Please try again.");
      triggerShake();
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
    <div className={`w-full max-w-lg mx-auto rounded-3xl bg-card/90 dark:bg-card/75 border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-xl backdrop-blur-xl space-y-6 transition-all ${isShaking ? "animate-shake" : ""}`}>
      {/* Title & Subtitle */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Sign in to your account to manage your chapter network.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Email Address */}
        <div className="space-y-1.5 group">
          <Label htmlFor="email" className="text-foreground font-medium text-xs sm:text-sm ml-1 transition-colors group-focus-within:text-primary">
            Email Address
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Mail className="h-5 w-5" />
            </div>
            <Input 
              id="email" 
              type="email" 
              placeholder="alexandra.chen@apextechnologies.io" 
              {...register("email")} 
              className={`bg-background/80 border-input text-foreground placeholder:text-muted-foreground pl-12 h-12 sm:h-13 rounded-2xl transition-all duration-200 focus-visible:ring-primary focus-visible:border-primary ${errors.email ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-500 font-medium flex items-center gap-1.5 ml-1 animate-in fade-in">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5 group">
          <div className="flex items-center justify-between ml-1">
            <Label htmlFor="password" className="text-foreground font-medium text-xs sm:text-sm transition-colors group-focus-within:text-primary">
              Password
            </Label>
            <Link href="/forgot-password" className="text-xs sm:text-sm font-medium text-primary hover:underline transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Lock className="h-5 w-5" />
            </div>
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              {...register("password")} 
              className={`bg-background/80 border-input text-foreground placeholder:text-muted-foreground pl-12 pr-12 h-12 sm:h-13 rounded-2xl transition-all duration-200 focus-visible:ring-primary focus-visible:border-primary ${errors.password ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
            />
            {/* Password Visibility Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-rose-500 font-medium flex items-center gap-1.5 ml-1 animate-in fade-in">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me Option */}
        <div className="flex items-center justify-between ml-1 pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary/40 cursor-pointer accent-indigo-600"
            />
            <span>Keep me signed in</span>
          </label>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 text-xs sm:text-sm font-medium bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 rounded-2xl flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 sm:h-13 text-sm sm:text-base transition-all rounded-2xl group flex items-center justify-center gap-2 shadow-md hover:shadow-primary/20 cursor-pointer" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <span>Sign in to Account</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>

        {/* Social Sign In Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-4 text-muted-foreground tracking-widest font-medium">Or continue with</span>
          </div>
        </div>

        {/* Google Social Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full border-border/80 hover:bg-muted/70 text-foreground font-medium h-12 sm:h-13 transition-all rounded-2xl flex items-center justify-center gap-3 cursor-pointer shadow-xs"
          onClick={handleGoogleLogin}
        >
          <svg className="h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
          Google
        </Button>

        {/* Sign up link */}
        <div className="text-center text-xs sm:text-sm text-muted-foreground pt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline font-semibold transition-colors">
            Register as Visitor
          </Link>
        </div>

      </form>
    </div>
  );
}
