"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { SupportedLanguage } from "@/lib/i18n/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "default" | "compact" | "minimal";
}

export function LanguageSwitcher({
  className,
  variant = "default",
}: LanguageSwitcherProps) {
  const { language, setLanguage, currentLanguage, languages, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("selectLanguage", "Select Language")}
          className={cn(
            "flex items-center gap-1.5 border border-[#141414] bg-white hover:bg-zinc-100 transition-colors cursor-pointer rounded-none text-xs font-mono text-[#141414] focus:outline-none focus:ring-1 focus:ring-[#141414]",
            variant === "compact"
              ? "px-2 py-1"
              : variant === "minimal"
              ? "p-1.5"
              : "px-2.5 py-1",
            className
          )}
        >
          <Globe className="w-3.5 h-3.5 text-[#F27D26] shrink-0" />
          <span className="font-bold uppercase tracking-wider">
            {currentLanguage.code}
          </span>
          {variant !== "minimal" && (
            <span className="hidden sm:inline text-[11px] text-[#141414]/70">
              {currentLanguage.nativeName}
            </span>
          )}
          <ChevronDown className="w-3 h-3 text-[#141414]/50 shrink-0 ml-0.5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 border border-[#141414] rounded-none bg-white p-0 shadow-lg text-xs font-mono z-50"
      >
        <div className="p-2.5 border-b border-[#141414] bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#F27D26]" />
            <span className="font-bold text-[11px] uppercase tracking-wider text-[#141414]">
              {t("selectLanguage", "Select Language")}
            </span>
          </div>
          <span className="text-[9px] px-1 py-0.2 bg-[#141414] text-white">
            I18N
          </span>
        </div>

        <div className="p-1 max-h-64 overflow-y-auto">
          {languages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code as SupportedLanguage)}
                className={cn(
                  "flex items-center justify-between px-2 py-2 cursor-pointer transition-colors rounded-none mb-0.5",
                  isSelected
                    ? "bg-[#141414] text-white focus:bg-[#141414] focus:text-white"
                    : "hover:bg-zinc-100 text-[#141414] focus:bg-zinc-100 focus:text-[#141414]"
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 border uppercase tracking-wider",
                      isSelected
                        ? "border-[#F27D26] text-[#F27D26] bg-black/40"
                        : "border-[#141414]/30 bg-zinc-50 text-[#141414]"
                    )}
                  >
                    {lang.code}
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="font-bold leading-tight">
                      {lang.nativeName}
                    </span>
                    <span
                      className={cn(
                        "text-[9px] leading-tight",
                        isSelected ? "text-white/70" : "text-[#141414]/50"
                      )}
                    >
                      {lang.name} • {lang.region}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[#F27D26] shrink-0 ml-2" />
                )}
              </DropdownMenuItem>
            );
          })}
        </div>

        <div className="border-t border-[#141414] p-1.5 bg-zinc-50 text-[9px] text-[#141414]/60 text-center uppercase tracking-wider">
          SYSTEM LOCALE // PERSISTED
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
