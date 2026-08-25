"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  Mountain,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";

/* ── Validation ────────────────────────────────────── */
const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

/* ── Animation variants ────────────────────────────── */
const panelVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ── Left panel ─────────────────────────────────────── */
function LeftPanel() {
  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      className="relative hidden flex-col justify-between overflow-hidden rounded-r-[2.5rem] bg-footer p-12 lg:flex lg:w-2/5 xl:p-16"
    >
      {/* Subtle dark vignette for depth */}
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/30"
        aria-hidden="true"
      />

      {/* Top content */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="relative z-10">
        <motion.p variants={fadeUp} className="font-ui text-[12px] font-semibold uppercase tracking-[0.25em] text-white">
          Thapliyal Home Stay CMS
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mt-12 font-heading text-4xl leading-[1.15] text-white xl:text-5xl"
        >
          Welcome back.
          <br />
          Continue creating
          <br />
          <em className="italic text-primary/75">peaceful</em> experiences.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-70 font-body text-sm leading-[1.85] text-white/80"
        >
          Manage retreat packages, galleries, enquiries and website content
          from one calm workspace.
        </motion.p>
      </motion.div>

      {/* Bottom quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="relative z-10"
      >
        <blockquote>
          <p className="font-heading text-lg italic leading-relaxed text-white">
            &ldquo;The quieter you become,
            <br />
            the more you can hear.&rdquo;
          </p>
        </blockquote>
      </motion.div>
    </motion.div>
  );
}

/* ── Logo mark ──────────────────────────────────────── */
function AdminLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <Image
        width={150}
        height={150}
        src="/logo.png"
        alt="Thapliyal Home Stay Logo"
        className="size-12 rounded-full object-cover"
      />
      <div>
        <p className="font-heading text-base font-semibold text-heading">Thapliyal Home Stay</p>
        <p className="font-ui text-[10px] uppercase tracking-widest text-muted/60">Retreat CMS</p>
      </div>
    </div>
  );
}

/* ── Main exported component ───────────────────────── */
export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [apiError, setApiError] = useState(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(data) {
    setApiError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, rememberMe }),
      });
      const json = await res.json();

      if (!json.success) {
        setApiError(json.message ?? "Login failed.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setApiError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left image panel */}
      <LeftPanel />

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center bg-background px-6 py-16">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[460px]"
        >
          <div className="rounded-[var(--radius-card)] bg-white px-8 py-10 shadow-sm ring-1 ring-border/50 md:px-10">
            {/* Logo */}
            <AdminLogo />

            {/* Heading */}
            <div className="mt-8 mb-7">
              <h2 className="font-heading text-3xl text-heading">Admin Login</h2>
              <p className="mt-1.5 font-body text-sm text-muted">
                Sign in to continue managing the website.
              </p>
            </div>

            {/* API error */}
            {apiError && (
              <div className="mb-6 rounded-xl bg-error/8 px-4 py-3 ring-1 ring-error/20">
                <p className="font-body text-sm text-error">{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex flex-col gap-5">

                {/* Email */}
                <div>
                  <label
                    htmlFor="login-email"
                    className="block font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
                  >
                    Email
                  </label>
                  <div className="relative mt-1.5">
                    <Mail
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted/50"
                      aria-hidden="true"
                    />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="admin@gmail.com"
                      className="pl-9"
                      autoComplete="email"
                      {...register("email")}
                      aria-invalid={!!errors.email}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 font-ui text-xs text-error" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="login-password"
                    className="block font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
                  >
                    Password
                  </label>
                  <div className="relative mt-1.5">
                    <Lock
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted/50"
                      aria-hidden="true"
                    />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-9 pr-10"
                      autoComplete="current-password"
                      {...register("password")}
                      aria-invalid={!!errors.password}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/50 transition-colors hover:text-muted"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 font-ui text-xs text-error" role="alert">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember me + forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2.5 font-body text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="size-4 cursor-pointer accent-primary"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed font-body text-sm text-muted/40"
                    aria-label="Forgot password (not available)"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={isSubmitting ? {} : { scale: 1.015 }}
                  whileTap={isSubmitting ? {} : { scale: 0.985 }}
                  className={cn(
                    "flex h-[52px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] font-body text-sm font-medium text-white transition-colors",
                    isSubmitting
                      ? "cursor-not-allowed bg-primary/70"
                      : "bg-primary hover:bg-primary-hover",
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      Signing in…
                    </>
                  ) : (
                    "Sign in"
                  )}
                </motion.button>

              </div>
            </form>

            {/* Version footer */}
            <p className="mt-8 text-center font-ui text-[11px] text-muted/35">
              Thapliyal Home Stay CMS · v1.0
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
