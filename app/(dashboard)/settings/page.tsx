import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Shield, Database, Server, Key, Lock, CheckCircle2 } from "lucide-react";
import { Role } from "@prisma/client";
import { LanguageSettingsCard } from "@/components/shared/language-settings-card";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumbs items={[{ label: "Settings & System" }]} />

      {/* Header */}
      <div className="pb-2 border-b border-[#141414]/20">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141414] font-mono uppercase">
          Workspace & Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#141414]/60 mt-0.5">
          Review your operational role permissions, language preferences, and system environment parameters.
        </p>
      </div>

      {/* Language Preferences Card */}
      <LanguageSettingsCard />

      {/* User Profile Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">User Identity</h2>
        <div className="flex items-center gap-4 pt-1">
          <UserAvatar name={user?.name || "User"} avatarUrl={user?.avatarUrl} size="lg" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
                {user?.name}
              </span>
              <Badge variant="indigo" className="uppercase font-mono text-[10px]">
                {user?.role}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-mono">{user?.email}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Department: {user?.department || "Operations Core"}
            </p>
          </div>
        </div>
      </div>

      {/* Role & Permissions Info Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Role-Based Access Matrix
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className={`p-4 rounded-xl border ${user?.role === Role.ADMIN ? "border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20" : "border-slate-200 dark:border-slate-800"}`}>
            <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">ADMIN</span>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
              <li>Full workspace governance</li>
              <li>Provision & deactivate accounts</li>
              <li>Delete projects and tasks</li>
              <li>Elevate member roles</li>
            </ul>
          </div>

          <div className={`p-4 rounded-xl border ${user?.role === Role.MANAGER ? "border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20" : "border-slate-200 dark:border-slate-800"}`}>
            <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">MANAGER</span>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
              <li>Initiate operational projects</li>
              <li>Create & assign tasks</li>
              <li>Update project milestones</li>
              <li>Register file assets</li>
            </ul>
          </div>

          <div className={`p-4 rounded-xl border ${user?.role === Role.MEMBER ? "border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20" : "border-slate-200 dark:border-slate-800"}`}>
            <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">MEMBER</span>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
              <li>Execute assigned tasks</li>
              <li>Advance task status</li>
              <li>Upload & reference docs</li>
              <li>View operational stream</li>
            </ul>
          </div>
        </div>
      </div>

      {/* System Environment */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Runtime Architecture & Database
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px]">DATABASE ENGINE</span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold">PostgreSQL (Prisma ORM v6)</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px]">AUTHENTICATION</span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold">NextAuth JWT / Credentials</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px]">VALIDATION LAYER</span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold">Zod Schema Server Actions</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px]">AUDIT LOGGING</span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold">Continuous ActivityLog Stream</span>
          </div>
        </div>
      </div>
    </div>
  );
}
