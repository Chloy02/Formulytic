import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { texts, target = 'kn' } = await request.json();

    if (!texts || !Array.isArray(texts)) {
      return NextResponse.json({ error: 'Texts array is required' }, { status: 400 });
    }

    const translations = await Promise.allSettled(
      texts.map(async (text: string) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000);

          const response = await fetch('https://libretranslate.de/translate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              q: text,
              source: 'en',
              target: target,
              format: 'text'
            }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`LibreTranslate API error: ${response.status}`);
          }

          const data = await response.json();
          return {
            originalText: text,
            translatedText: data.translatedText || text
          };
        } catch (error) {
          console.warn('Translation failed for:', text, error);
          return {
            originalText: text,
            translatedText: text // Fallback to original text
          };
        }
      })
    );

    const results = translations.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          originalText: texts[index],
          translatedText: texts[index] // Fallback to original text
        };
      }
    });

    return NextResponse.json({ 
      translations: results,
      target: target 
    });

  } catch (error: any) {
    console.error('Batch translation API error:', error);
    
    return NextResponse.json({ 
      error: error.message,
      translations: []
    }, { status: 500 });
  }
}
