"use client";

import React, { useState, useEffect } from "react";
import { UserAvatar } from "./user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { Menu, LogOut, Shield, ChevronDown, Clock } from "lucide-react";
import { Role } from "@prisma/client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage } from "@/lib/i18n/language-context";

interface HeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    department?: string | null;
    avatarUrl?: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [timeStr, setTimeStr] = useState<string>("");
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toISOString().substring(11, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return (
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border border-red-600 bg-red-50 text-red-700">
            {t("roleAdmin", "ADMIN")}
          </span>
        );
      case Role.MANAGER:
        return (
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border border-[#141414] bg-[#141414] text-white">
            {t("roleManager", "MANAGER")}
          </span>
        );
      case Role.MEMBER:
        return (
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border border-[#141414] bg-white text-[#141414]">
            {t("roleMember", "MEMBER")}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-[#141414] bg-[#E4E3E0]/90 backdrop-blur-xs px-4 md:px-6 text-[#141414]">
      {/* Mobile Sidebar Trigger & Breadcrumb Left Area */}
      <div className="flex items-center gap-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden h-8 w-8 border-[#141414] bg-white text-[#141414] rounded-none"
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-[#E4E3E0] border-r border-[#141414]">
            <Sidebar userRole={user.role} onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
          <span className="text-[#141414]/50">/</span>
          <span className="font-bold tracking-tight text-[#141414]">OPSPULSE</span>
          <span className="text-[#141414]/50">/</span>
          <span className="text-[#141414]/70 uppercase">{t("workspaceOps", "WORKSPACE-OPS")}</span>
        </div>
      </div>

      {/* Right Header Area: Live UTC + Language Switcher + Role + User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {/* Live Technical UTC Clock */}
        {timeStr && (
          <div className="hidden lg:flex items-center gap-1.5 font-mono text-[11px] text-[#141414]/70 border border-[#141414]/20 px-2 py-0.5 bg-white">
            <Clock className="w-3 h-3 text-[#F27D26]" />
            <span>{timeStr}</span>
          </div>
        )}

        {/* Global Language Switcher */}
        <LanguageSwitcher />

        {/* Role Indicator */}
        <div className="hidden xs:block">{getRoleBadge(user.role)}</div>

        {/* User Account Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 p-1 border border-[#141414] bg-white hover:bg-zinc-100 transition-colors cursor-pointer rounded-none">
              <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="sm" />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-[#141414] leading-none">
                  {user.name}
                </span>
                <span className="text-[10px] font-mono text-[#141414]/60 leading-none mt-0.5">
                  {user.department || user.email}
                </span>
              </div>
              <ChevronDown className="hidden md:block w-3.5 h-3.5 text-[#141414]/60 mr-1" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border border-[#141414] rounded-none bg-white p-0 shadow-lg text-xs font-mono">
            <div className="p-3 border-b border-[#141414] bg-zinc-50">
              <p className="font-bold text-sm text-[#141414]">{user.name}</p>
              <p className="text-[11px] text-[#141414]/60 truncate">{user.email}</p>
              <div className="pt-2">{getRoleBadge(user.role)}</div>
            </div>
            <div className="p-1">
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#141414] hover:text-white cursor-pointer transition-colors">
                  <span className="uppercase">{t("settings", "SETTINGS")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tasks" className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#141414] hover:text-white cursor-pointer transition-colors">
                  <span className="uppercase">{t("myAssignedTasks", "MY ASSIGNED TASKS")}</span>
                </Link>
              </DropdownMenuItem>
              {user.role === Role.ADMIN && (
                <DropdownMenuItem asChild>
                  <Link href="/team" className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#141414] hover:text-white cursor-pointer transition-colors">
                    <span className="uppercase">{t("manageTeamRoster", "MANAGE TEAM ROSTER")}</span>
                  </Link>
                </DropdownMenuItem>
              )}
            </div>
            <div className="border-t border-[#141414] p-1 bg-zinc-50">
              <DropdownMenuItem
                className="text-red-600 hover:bg-red-600 hover:text-white px-2 py-1.5 cursor-pointer transition-colors"
                onClick={() => {
                  signOut({ callbackUrl: "/login" });
                }}
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                <span className="uppercase">{t("signOut", "SIGN OUT")}</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
