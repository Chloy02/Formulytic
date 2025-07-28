import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
// import { offlineTranslations } from '../utils/offlineTranslations';

interface TranslationCache {
  [key: string]: string;
}

export const useDynamicTranslation = () => {
  const { language } = useTranslation();
  const [translationCache, setTranslationCache] = useState<TranslationCache>({});
  const [isTranslating, setIsTranslating] = useState(false);

  // Generate cache key for text + language
  const getCacheKey = (text: string, targetLang: string) => {
    return `${text}_${targetLang}`;
  };

  // Translate text using LibreTranslate API
  const translateText = useCallback(async (text: string, targetLang: string = 'kn'): Promise<string> => {
    // If target language is English, return original text
    if (targetLang === 'en') {
      return text;
    }

    const cacheKey = getCacheKey(text, targetLang);
    
    // Check cache first
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    // If text is empty or just whitespace, return as is
    if (!text || text.trim().length === 0) {
      return text;
    }

    // // Check offline translations first (instant)
    // if (offlineTranslations[text]) {
    //   const offlineTranslation = offlineTranslations[text];
      
    //   // Cache the offline translation
    //   setTranslationCache(prev => ({
    //     ...prev,
    //     [cacheKey]: offlineTranslation
    //   }));
      
    //   return offlineTranslation;
    // }

    try {
      setIsTranslating(true);
      
      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: targetLang,
          format: 'text'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const translatedText = data.translatedText || text;

      // Cache the translation
      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: translatedText
      }));

      return translatedText;
    } catch (error) {
      console.warn('Translation failed for:', text, 'Error:', error);
      
      // Fallback: Try word-by-word translation for simple phrases
      const words = text.split(' ');
      if (words.length <= 3) {
        const translatedWords = words.map(word => offlineTranslations[word] || word);
        if (translatedWords.some(word => offlineTranslations[words[translatedWords.indexOf(word)]])) {
          const fallbackTranslation = translatedWords.join(' ');
          
          // Cache the fallback translation
          setTranslationCache(prev => ({
            ...prev,
            [cacheKey]: fallbackTranslation
          }));
          
          return fallbackTranslation;
        }
      }
      
      // Return original text if no fallback available
      return text;
    } finally {
      setIsTranslating(false);
    }
  }, [translationCache]);

  // Batch translate multiple texts
  const translateBatch = useCallback(async (texts: string[], targetLang: string = 'kn'): Promise<string[]> => {
    if (targetLang === 'en') {
      return texts;
    }

    const translations = await Promise.all(
      texts.map(text => translateText(text, targetLang))
    );
    
    return translations;
  }, [translateText]);

  // Hook for dynamic translation based on current language
  const dt = useCallback(async (text: string): Promise<string> => {
    return await translateText(text, language);
  }, [translateText, language]);

  // Synchronous version that returns cached translation or original text
  const dtSync = useCallback((text: string): string => {
    if (language === 'en') {
      return text;
    }

    const cacheKey = getCacheKey(text, language);
    return translationCache[cacheKey] || text;
  }, [translationCache, language]);

  return {
    translateText,
    translateBatch,
    dt, // Dynamic translate (async)
    dtSync, // Dynamic translate sync (cached only)
    isTranslating,
    translationCache
  };
};

// React component hook for automatic translation
export const useAutoTranslate = (text: string, deps: any[] = []) => {
  const { language } = useTranslation();
  const { translateText } = useDynamicTranslation();
  const [translatedText, setTranslatedText] = useState(text);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Debounce translation to avoid too many API calls
    const timeoutId = setTimeout(() => {
      const performTranslation = async () => {
        if (!text || language === 'en') {
          setTranslatedText(text);
          return;
        }

        // Don't show loading for very short text
        if (text.length > 5) {
          setLoading(true);
        }
        
        try {
          const translated = await translateText(text, language);
          setTranslatedText(translated);
        } catch (error) {
          console.warn('Auto-translation error for:', text, error);
          setTranslatedText(text); // Fallback to original text
        } finally {
          setLoading(false);
        }
      };

      performTranslation();
    }, 100); // 100ms debounce

    return () => clearTimeout(timeoutId);
  }, [text, language, translateText, ...deps]);

  return { translatedText, loading };
};
