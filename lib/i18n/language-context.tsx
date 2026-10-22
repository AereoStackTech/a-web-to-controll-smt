"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  LanguageOption,
  translations,
  TranslationKey,
} from "./translations";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey, fallback?: string) => string;
  currentLanguage: LanguageOption;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "opspulse_language";

function applyDocumentLanguage(lang: SupportedLanguage) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang;
    const option = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    document.documentElement.dir = option?.dir || "ltr";
  }
}

function getInitialLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
    if (saved && translations[saved]) {
      return saved;
    }
    const browserLang = navigator.language.slice(0, 2) as SupportedLanguage;
    if (translations[browserLang]) {
      return browserLang;
    }
  } catch {
    // ignore
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(getInitialLanguage);

  useEffect(() => {
    applyDocumentLanguage(language);
  }, [language]);

  const setLanguage = (lang: SupportedLanguage) => {
    if (translations[lang]) {
      setLanguageState(lang);
      try {
        localStorage.setItem(STORAGE_KEY, lang);
        document.cookie = `opspulse_lang=${lang}; path=/; max-age=31536000`;
      } catch {
        // ignore
      }
      applyDocumentLanguage(lang);
    }
  };

  const t = (key: TranslationKey, fallback?: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    if (translations.en[key]) {
      return translations.en[key];
    }
    return fallback || key;
  };

  const currentLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLanguage,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "en" as SupportedLanguage,
      setLanguage: () => {},
      t: (key: TranslationKey, fallback?: string) => translations.en[key] || fallback || key,
      currentLanguage: SUPPORTED_LANGUAGES[0],
      languages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
}
