import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { texts, targetLanguage } = await request.json();
    
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json({ error: 'Texts array is required' }, { status: 400 });
    }
    
    if (!targetLanguage) {
      return NextResponse.json({ error: 'Target language is required' }, { status: 400 });
    }

    const microsoftTranslatorKey = process.env.MICROSOFT_TRANSLATOR_KEY;
    const microsoftTranslatorRegion = process.env.MICROSOFT_TRANSLATOR_REGION;

    if (!microsoftTranslatorKey || microsoftTranslatorKey.trim() === '') {
      console.log('Microsoft Translator credentials not available, returning original texts');
      return NextResponse.json({ 
        translations: texts.map((text, index) => ({
          originalText: text,
          translatedText: text,
          index
        }))
      });
    }

    // Microsoft Translator API
    const microsoftTranslations = await Promise.allSettled(
      texts.map(async (text, index) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000);

          const route = `/translate?api-version=3.0&from=en&to=${targetLanguage}`;
          const endpoint = 'https://api.cognitive.microsofttranslator.com';
          const requestBody = [{ Text: text }];

          const response = await fetch(endpoint + route, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': microsoftTranslatorKey,
              'Ocp-Apim-Subscription-Region': microsoftTranslatorRegion || ''
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            console.log(`Microsoft Translator failed for text ${index}: ${response.status}`);
            return {
              originalText: text,
              translatedText: text,
              index
            };
          }

          const data = await response.json();
          return {
            originalText: text,
            translatedText: data[0]?.translations[0]?.text || text,
            index
          };
        } catch (error) {
          console.log(`Error translating text ${index} with Microsoft Translator:`, error);
          return {
            originalText: text,
            translatedText: text,
            index
          };
        }
      })
    );

    const translations = microsoftTranslations.map(result => 
      result.status === 'fulfilled' ? result.value : {
        originalText: texts[result.reason?.index] || '',
        translatedText: texts[result.reason?.index] || '',
        index: result.reason?.index || 0
      }
    );

    return NextResponse.json({ translations });

  } catch (error) {
    console.error('Batch translation error:', error);
    return NextResponse.json({ 
      error: 'Failed to translate texts',
      translations: []
    }, { status: 500 });
  }
}
