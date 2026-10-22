"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { SupportedLanguage } from "@/lib/i18n/translations";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageSettingsCard() {
  const { language, setLanguage, languages, t, currentLanguage } = useLanguage();

  return (
    <div className="border border-[#141414] bg-white p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#141414]/20 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#F27D26]" />
          <div>
            <h2 className="text-sm font-bold text-[#141414] uppercase tracking-wide font-mono">
              {t("language", "Language")} &amp; Internationalization (i18n)
            </h2>
            <p className="text-xs text-[#141414]/60">
              Select your preferred operational language across workspace modules and interfaces.
            </p>
          </div>
        </div>
        <span className="font-mono text-xs px-2 py-0.5 border border-[#141414] bg-zinc-100 uppercase">
          {currentLanguage.code} {"//"} {currentLanguage.nativeName}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
        {languages.map((lang) => {
          const isSelected = lang.code === language;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code as SupportedLanguage)}
              className={cn(
                "p-3 border text-left flex flex-col justify-between transition-all cursor-pointer rounded-none relative group",
                isSelected
                  ? "border-[#141414] bg-[#141414] text-white shadow-xs"
                  : "border-[#141414]/30 bg-zinc-50 hover:border-[#141414] hover:bg-white text-[#141414]"
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={cn(
                    "text-[10px] font-mono font-bold px-1.5 py-0.5 border uppercase",
                    isSelected
                      ? "border-[#F27D26] text-[#F27D26] bg-black/40"
                      : "border-[#141414]/30 bg-white text-[#141414]"
                  )}
                >
                  {lang.code}
                </span>
                {isSelected && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-[#F27D26]">
                    <Check className="w-3.5 h-3.5" />
                    ACTIVE
                  </span>
                )}
              </div>

              <div>
                <span className="block font-bold text-xs">{lang.nativeName}</span>
                <span
                  className={cn(
                    "block text-[11px]",
                    isSelected ? "text-white/70" : "text-[#141414]/60"
                  )}
                >
                  {lang.name}
                </span>
                <span
                  className={cn(
                    "block text-[9px] font-mono mt-1",
                    isSelected ? "text-white/50" : "text-[#141414]/40"
                  )}
                >
                  {lang.region}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-[10px] font-mono text-[#141414]/60 border-t border-[#141414]/10 pt-2 flex items-center justify-between">
        <span>LOCALE STORAGE: LOCALSTORAGE + COOKIE SYNC</span>
        <span>DIRECTION: {currentLanguage.dir.toUpperCase()}</span>
      </div>
    </div>
  );
}
