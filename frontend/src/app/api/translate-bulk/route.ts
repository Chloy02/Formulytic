import { NextRequest, NextResponse } from 'next/server';

interface BulkTranslationRequest {
  texts: string[];
  target: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: BulkTranslationRequest = await request.json();
    const { texts, target } = body;

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json(
        { error: 'Invalid texts array' },
        { status: 400 }
      );
    }

    if (!target || (target !== 'kn' && target !== 'en')) {
      return NextResponse.json(
        { error: 'Invalid target language. Supported: kn, en' },
        { status: 400 }
      );
    }

    // If target is English, return original texts
    if (target === 'en') {
      const translations: Record<string, string> = {};
      texts.forEach(text => {
        translations[text] = text;
      });
      return NextResponse.json({ translations });
    }

    // For Kannada translation, use Microsoft Translator API
    const translationPromises = texts.map(async (text) => {
      try {
        // Skip empty or whitespace-only texts
        if (!text || text.trim().length === 0) {
          return { original: text, translated: text };
        }

        const response = await fetch('https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=kn', {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': process.env.AZURE_TRANSLATOR_KEY!,
            'Ocp-Apim-Subscription-Region': process.env.AZURE_TRANSLATOR_REGION!,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([{ text: text }]),
        });

        if (!response.ok) {
          console.warn(`Translation failed for "${text}":`, response.status);
          return { original: text, translated: text };
        }

        const data = await response.json();
        const translatedText = data[0]?.translations?.[0]?.text || text;
        
        return { original: text, translated: translatedText };
      } catch (error) {
        console.warn(`Translation error for "${text}":`, error);
        return { original: text, translated: text };
      }
    });

    // Wait for all translations to complete
    const results = await Promise.all(translationPromises);
    
    // Build translation map
    const translations: Record<string, string> = {};
    results.forEach(({ original, translated }) => {
      translations[original] = translated;
    });

    console.log(`Bulk translated ${texts.length} texts to ${target}`);
    
    return NextResponse.json({ translations });

  } catch (error) {
    console.error('Bulk translation endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error during bulk translation' },
      { status: 500 }
    );
  }
}
