"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { offlineTranslations } from '@/utils/offlineTranslations';

type Language = 'en' | 'kn';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (text: string) => string;
  isLoading: boolean;
  translations: Record<string, string>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load language preference from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('formulytic-language') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'kn')) {
        setLanguageState(savedLanguage);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('formulytic-language', lang);
    }
  };

  const t = (text: string): string => {
    if (language === 'en') {
      return text;
    }

    // First check offline translations for instant result
    const normalizedText = text.toLowerCase();
    if (offlineTranslations[text] || offlineTranslations[normalizedText]) {
      return offlineTranslations[text] || offlineTranslations[normalizedText];
    }

    // Check cached dynamic translations
    if (translations[text]) {
      return translations[text];
    }

    // For uncached translations, try LibreTranslate API
    if (language === 'kn') {
      translateWithAPI(text);
    }

    return text; // Return original text while translation is pending
  };

  const translateWithAPI = async (text: string) => {
    try {
      setIsLoading(true);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: 'kn',
          format: 'text'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.translatedText || text;

      // Cache the translation
      setTranslations(prev => ({
        ...prev,
        [text]: translatedText
      }));

    } catch (error) {
      console.warn('Translation failed for:', text, error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: TranslationContextType = {
    language,
    setLanguage,
    t,
    isLoading,
    translations
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

export type { Language, TranslationContextType };
