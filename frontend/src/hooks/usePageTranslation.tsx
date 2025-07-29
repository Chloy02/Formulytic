"use client";

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../contexts/TranslationContext';

interface PageTranslationOptions {
  enableBulkTranslation?: boolean;
  autoTranslateOnLanguageChange?: boolean;
  excludeSelectors?: string[];
}

interface BulkTranslationRequest {
  texts: string[];
  target: string;
}

interface BulkTranslationResponse {
  translations: Record<string, string>;
}

export function usePageTranslation(options: PageTranslationOptions = {}) {
  const { language, translations, setLanguage: contextSetLanguage } = useTranslation();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache, setTranslationCache] = useState<Record<string, string>>({});

  const {
    enableBulkTranslation = true,
    autoTranslateOnLanguageChange = true,
    excludeSelectors = ['script', 'style', 'noscript', '[data-no-translate]']
  } = options;

  // Extract all text content from the page
  const extractPageTexts = useCallback((): string[] => {
    const texts: string[] = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          // Skip excluded elements
          for (const selector of excludeSelectors) {
            if (parent.closest(selector)) {
              return NodeFilter.FILTER_REJECT;
            }
          }

          const text = node.textContent?.trim();
          if (text && text.length > 0 && !/^\s*$/.test(text)) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent?.trim();
      if (text && !texts.includes(text)) {
        texts.push(text);
      }
    }

    return texts;
  }, [excludeSelectors]);

  // Extract texts from questionnaire data structure
  const extractQuestionnaireTexts = useCallback((questionnaire: any): string[] => {
    const texts: string[] = [];
    
    const extractFromObject = (obj: any) => {
      if (typeof obj === 'string' && obj.trim().length > 0) {
        if (!texts.includes(obj.trim())) {
          texts.push(obj.trim());
        }
      } else if (Array.isArray(obj)) {
        obj.forEach(extractFromObject);
      } else if (obj && typeof obj === 'object') {
        Object.values(obj).forEach(extractFromObject);
      }
    };

    extractFromObject(questionnaire);
    return texts;
  }, []);

  // Bulk translate multiple texts at once
  const bulkTranslate = useCallback(async (texts: string[], targetLanguage: string = 'kn'): Promise<Record<string, string>> => {
    if (targetLanguage === 'en') {
      // No translation needed for English
      const result: Record<string, string> = {};
      texts.forEach(text => {
        result[text] = text;
      });
      return result;
    }

    // Filter out already translated texts
    const textsToTranslate = texts.filter(text => !translationCache[text] && !translations[text]);
    
    if (textsToTranslate.length === 0) {
      // Return cached translations
      const result: Record<string, string> = {};
      texts.forEach(text => {
        result[text] = translationCache[text] || translations[text] || text;
      });
      return result;
    }

    setIsTranslating(true);

    try {
      const response = await fetch('/api/translate-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts: textsToTranslate,
          target: targetLanguage
        } as BulkTranslationRequest)
      });

      if (!response.ok) {
        throw new Error(`Bulk translation API error: ${response.status}`);
      }

      const data: BulkTranslationResponse = await response.json();
      
      // Update cache
      setTranslationCache(prev => ({
        ...prev,
        ...data.translations
      }));

      // Return all translations (cached + new)
      const result: Record<string, string> = {};
      texts.forEach(text => {
        result[text] = data.translations[text] || translationCache[text] || translations[text] || text;
      });

      return result;

    } catch (error) {
      console.warn('Bulk translation failed:', error);
      // Return original texts as fallback
      const result: Record<string, string> = {};
      texts.forEach(text => {
        result[text] = text;
      });
      return result;
    } finally {
      setIsTranslating(false);
    }
  }, [translationCache, translations]);

  // Translate questionnaire data structure
  const translateQuestionnaire = useCallback(async (questionnaire: any, targetLanguage: string = 'kn'): Promise<any> => {
    if (targetLanguage === 'en') {
      return questionnaire;
    }

    const texts = extractQuestionnaireTexts(questionnaire);
    const translationMap = await bulkTranslate(texts, targetLanguage);

    const translateObject = (obj: any): any => {
      if (typeof obj === 'string' && obj.trim().length > 0) {
        return translationMap[obj.trim()] || obj;
      } else if (Array.isArray(obj)) {
        return obj.map(translateObject);
      } else if (obj && typeof obj === 'object') {
        const translated: any = {};
        Object.keys(obj).forEach(key => {
          translated[key] = translateObject(obj[key]);
        });
        return translated;
      }
      return obj;
    };

    return translateObject(questionnaire);
  }, [extractQuestionnaireTexts, bulkTranslate]);

  // Translate entire page content
  const translatePage = useCallback(async (targetLanguage: string = 'kn') => {
    if (!enableBulkTranslation || targetLanguage === 'en') {
      return;
    }

    const texts = extractPageTexts();
    const translationMap = await bulkTranslate(texts, targetLanguage);

    // Apply translations to the DOM
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          for (const selector of excludeSelectors) {
            if (parent.closest(selector)) {
              return NodeFilter.FILTER_REJECT;
            }
          }

          const text = node.textContent?.trim();
          if (text && text.length > 0 && translationMap[text]) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      const originalText = node.textContent?.trim();
      if (originalText && translationMap[originalText]) {
        node.textContent = translationMap[originalText];
      }
    }
  }, [enableBulkTranslation, extractPageTexts, bulkTranslate, excludeSelectors]);

  // Auto-translate on language change
  useEffect(() => {
    if (autoTranslateOnLanguageChange && language === 'kn') {
      translatePage(language);
    }
  }, [language, autoTranslateOnLanguageChange, translatePage]);

  // Enhanced setLanguage that triggers page translation
  const setLanguage = useCallback((lang: 'en' | 'kn') => {
    contextSetLanguage(lang);
    if (autoTranslateOnLanguageChange && lang === 'kn') {
      setTimeout(() => translatePage(lang), 100);
    }
  }, [contextSetLanguage, autoTranslateOnLanguageChange, translatePage]);

  // Get translation for a single text (with caching)
  const getTranslation = useCallback((text: string): string => {
    if (language === 'en') return text;
    return translationCache[text] || translations[text] || text;
  }, [language, translationCache, translations]);

  return {
    language,
    setLanguage,
    isTranslating,
    translateQuestionnaire,
    translatePage,
    bulkTranslate,
    getTranslation,
    translationCache
  };
}
