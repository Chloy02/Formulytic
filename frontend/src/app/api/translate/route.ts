import { NextRequest, NextResponse } from 'next/server';

// LibreTranslate endpoints - local first, then fallbacks
const LIBRETRANSLATE_ENDPOINTS = [
  'http://localhost:5000/translate',  // Local Docker instance
  'https://libretranslate.com/translate',
  'https://translate.argosopentech.com/translate',
  'https://translate.mentality.rip/translate'
];

async function translateWithLibreTranslate(text: string, target: string, endpoint: string, timeoutMs: number = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
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
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, target = 'kn' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Try each LibreTranslate endpoint until one works
    let translatedText = text;
    let lastError: any = null;

    for (const endpoint of LIBRETRANSLATE_ENDPOINTS) {
      try {
        console.log(`Trying translation endpoint: ${endpoint}`);
        translatedText = await translateWithLibreTranslate(text, target, endpoint, 8000);
        console.log(`Translation successful with endpoint: ${endpoint}`);
        break;
      } catch (error: any) {
        console.warn(`Translation failed with endpoint ${endpoint}:`, error.message);
        lastError = error;
        continue;
      }
    }

    // If all endpoints failed, log the error but still return a response
    if (translatedText === text && lastError) {
      console.error('All translation endpoints failed. Last error:', lastError.message);
    }

    return NextResponse.json({ 
      originalText: text,
      translatedText: translatedText,
      target: target 
    });

  } catch (error: any) {
    console.error('Translation API error:', error);
    
    // Try to parse request again for fallback
    let fallbackText = '';
    try {
      const body = await request.clone().json();
      fallbackText = body.text || '';
    } catch {
      // If we can't parse the request, use empty string
    }
    
    return NextResponse.json({ 
      originalText: fallbackText,
      translatedText: fallbackText, // Fallback to original text
      target: 'kn',
      error: 'Translation service temporarily unavailable'
    }, { status: 200 }); // Return 200 instead of 500 since we're providing fallback
  }
}
