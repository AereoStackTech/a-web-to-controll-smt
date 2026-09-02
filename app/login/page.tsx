"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("admin@opspulse.internal");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleQuickFill = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("Password123!");
    setError(null);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-block border border-[#141414] bg-[#141414] text-[#E4E3E0] px-4 py-2 mb-2">
          <span className="text-2xl font-bold tracking-tighter uppercase italic text-[#E4E3E0]">OpsPulse</span>
        </div>
        <h1 className="text-xs font-mono font-bold tracking-widest uppercase text-[#141414]">
          INTERNAL ENTERPRISE OPERATIONS CONSOLE
        </h1>
      </div>

      {/* Login Card */}
      <div className="border border-[#141414] bg-white p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="border-b border-[#141414] pb-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#141414]">
            AUTHENTICATE WORKSPACE SESSION
          </h2>
          <p className="text-xs text-[#141414]/60 mt-0.5">
            Enter enterprise credentials to access operational resources.
          </p>
        </div>

        {error && (
          <div className="p-3 border border-red-600 bg-red-50 text-red-700 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#141414]">
              WORK EMAIL
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-[#141414]/40" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@opspulse.internal"
                required
                className="pl-9 rounded-none border-[#141414] bg-white text-[#141414] font-mono text-xs placeholder:text-[#141414]/40 focus-visible:ring-[#141414]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#141414]">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-[#141414]/40" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="pl-9 rounded-none border-[#141414] bg-white text-[#141414] font-mono text-xs placeholder:text-[#141414]/40 focus-visible:ring-[#141414]"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-[#141414] hover:bg-zinc-800 text-white font-mono text-xs font-bold uppercase tracking-wider border border-[#141414]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                VERIFYING SESSION...
              </>
            ) : (
              <>
                ENTER WORKSPACE <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </form>

        {/* Quick 1-Click Role Logins */}
        <div className="pt-4 border-t border-[#141414]/20 space-y-2">
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#141414]/60">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F27D26]" />
            <span>TEST CREDENTIAL PRESETS</span>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono">
            <button
              type="button"
              onClick={() => handleQuickFill("admin@opspulse.internal")}
              className="flex flex-col items-center justify-center p-2 border border-[#141414] bg-zinc-50 hover:bg-[#141414] hover:text-white transition-all text-left group cursor-pointer"
            >
              <span className="text-[10px] font-bold text-red-600 group-hover:text-red-400">ADMIN</span>
              <span className="text-[9px] text-[#141414]/60 group-hover:text-white/80 truncate max-w-full">Eleanor (Lead)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill("manager@opspulse.internal")}
              className="flex flex-col items-center justify-center p-2 border border-[#141414] bg-zinc-50 hover:bg-[#141414] hover:text-white transition-all text-left group cursor-pointer"
            >
              <span className="text-[10px] font-bold text-[#F27D26] group-hover:text-[#F27D26]">MANAGER</span>
              <span className="text-[9px] text-[#141414]/60 group-hover:text-white/80 truncate max-w-full">Marcus (TPM)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill("member@opspulse.internal")}
              className="flex flex-col items-center justify-center p-2 border border-[#141414] bg-zinc-50 hover:bg-[#141414] hover:text-white transition-all text-left group cursor-pointer"
            >
              <span className="text-[10px] font-bold text-sky-700 group-hover:text-sky-400">MEMBER</span>
              <span className="text-[9px] text-[#141414]/60 group-hover:text-white/80 truncate max-w-full">Sarah (Eng)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="text-center font-mono text-[10px] text-[#141414]/60">
        OPSPULSE CORE // SYSTEM NODE #4829 // AUDIT STREAM ACTIVE
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#E4E3E0] p-4 font-sans text-[#141414]">
      <Suspense fallback={<div className="font-mono text-xs uppercase">LOADING AUTH CONSOLE...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
