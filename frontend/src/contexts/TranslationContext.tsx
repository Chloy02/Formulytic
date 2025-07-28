"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  const [translatingTexts, setTranslatingTexts] = useState<Set<string>>(new Set());

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
    console.log('Translation called for:', text, 'Language:', language);
    
    if (language === 'en') {
      return text;
    }

    // Check cached dynamic translations
    if (translations[text]) {
      console.log('Found cached translation:', text, '->', translations[text]);
      return translations[text];
    }

    // For uncached translations, try LibreTranslate API asynchronously (no setState during render)
    if (language === 'kn' && !translatingTexts.has(text)) {
      console.log('Attempting API translation for:', text);
      // Use setTimeout to avoid setState during render
      setTimeout(() => {
        translateWithAPI(text);
      }, 0);
    }

    console.log('Returning original text:', text);
    return text; // Return original text while translation is pending
  };

  const translateWithAPI = async (text: string) => {
    console.log('translateWithAPI called for:', text);
    
    // Check if we already have this translation or if it's already being processed
    if (translations[text] || translatingTexts.has(text)) {
      console.log('Translation already exists or in progress for:', text);
      return;
    }

    // Mark as being translated
    setTranslatingTexts(prev => new Set(prev).add(text));
    console.log('Marked as translating:', text);

    try {
      console.log('Making server-side API request for:', text);
      
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          target: 'kn'
        })
      });

      if (!response.ok) {
        throw new Error(`Server translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.translatedText || text;
      
      console.log('Server API translation result:', text, '->', translatedText);

      // Cache the translation
      setTranslations(prev => ({
        ...prev,
        [text]: translatedText
      }));

    } catch (error) {
      console.warn('Translation failed for:', text, error);
      // Still cache the original text to avoid repeated API calls
      setTranslations(prev => ({
        ...prev,
        [text]: text
      }));
    } finally {
      // Remove from translating set
      setTranslatingTexts(prev => {
        const newSet = new Set(prev);
        newSet.delete(text);
        return newSet;
      });
      console.log('Finished translating:', text);
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
