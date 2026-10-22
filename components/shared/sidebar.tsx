"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  CheckSquare,
  FileText,
  Users,
  Activity,
  Settings,
  LayoutDashboard,
  Shield,
  Layers,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import { useLanguage } from "@/lib/i18n/language-context";

interface SidebarProps {
  userRole?: Role;
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ userRole = Role.MEMBER, className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navigation = [
    { name: t("overview", "Overview"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("projects", "Projects"), href: "/projects", icon: FolderKanban },
    { name: t("taskOperations", "Task Operations"), href: "/tasks", icon: CheckSquare },
    { name: t("assetLibrary", "Asset & File Library"), href: "/files", icon: FileText },
    ...(userRole === Role.ADMIN
      ? [
          {
            name: t("teamRoster", "Team Roster"),
            href: "/team",
            icon: Users,
            adminOnly: true,
          },
        ]
      : []),
    { name: t("auditStream", "Audit Stream"), href: "/activity", icon: Activity },
    { name: t("settings", "Settings"), href: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-[#E4E3E0] text-[#141414] border-r border-[#141414] select-none",
        className
      )}
    >
      {/* Workspace Brand Header */}
      <div className="flex flex-col gap-1 p-5 bg-[#141414] text-[#E4E3E0] border-b border-[#141414]">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold tracking-tighter uppercase italic text-[#E4E3E0]">
            OpsPulse
          </span>
          <span className="text-[10px] font-mono tracking-widest text-[#F27D26] border border-[#F27D26]/40 px-1.5 py-0.5">
            ENTERPRISE
          </span>
        </div>
        <span className="text-[10px] font-mono tracking-widest text-[#E4E3E0]/60">
          SYS://INTERNAL-OPS-V2.4
        </span>
      </div>

      {/* Quick Action Bar for Managers/Admins */}
      {(userRole === Role.ADMIN || userRole === Role.MANAGER) && (
        <div className="p-3 border-b border-[#141414]/20">
          <div className="flex items-center gap-2">
            <Link
              href="/tasks/new"
              onClick={onNavigate}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#141414] hover:bg-zinc-800 text-[#E4E3E0] text-xs font-mono font-medium tracking-wide uppercase transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#F27D26]" />
              <span>{t("addTask", "+ Task")}</span>
            </Link>
            <Link
              href="/projects/new"
              onClick={onNavigate}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white hover:bg-zinc-100 text-[#141414] border border-[#141414] text-xs font-mono font-medium tracking-wide uppercase transition-colors"
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>{t("addProject", "+ Project")}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Navigation links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-2 py-1.5 text-[10px] font-mono font-semibold text-[#141414]/60 uppercase tracking-widest">
          {t("workspaceModules", "Workspace Modules")}
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center justify-between px-3 py-2 text-xs font-medium border transition-all",
                isActive
                  ? "bg-[#141414] text-[#E4E3E0] border-[#141414]"
                  : "text-[#141414] border-transparent hover:border-[#141414]/20 hover:bg-black/5"
              )}
            >
              <div className="flex items-center gap-2.5">
                {isActive ? (
                  <span className="w-2 h-2 rounded-full bg-[#F27D26] shrink-0" />
                ) : (
                  <Icon className="h-4 w-4 text-[#141414]/60 group-hover:text-[#141414] shrink-0" />
                )}
                <span className={cn(isActive && "font-semibold")}>{item.name}</span>
              </div>
              {item.adminOnly && (
                <span
                  className={cn(
                    "text-[9px] font-mono px-1 py-0.5 border uppercase",
                    isActive
                      ? "border-[#F27D26] text-[#F27D26]"
                      : "border-[#141414]/40 text-[#141414]/70"
                  )}
                >
                  {t("roleAdmin", "ADMIN")}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Workspace Environment Tag */}
      <div className="p-3 border-t border-[#141414] bg-[#E4E3E0]">
        <div className="border border-[#141414] bg-white p-2 flex items-center justify-between text-xs text-[#141414]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#F27D26]" />
            <span className="font-mono text-[10px] tracking-tight font-semibold">{t("systemNode", "OPSPULSE-NODE-01")}</span>
          </div>
          <span className="text-[9px] font-mono px-1 bg-[#141414] text-white uppercase">{t("online", "ONLINE")}</span>
        </div>
      </div>
    </aside>
  );
}
