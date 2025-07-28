import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, target = 'kn' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Call LibreTranslate API from server side
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch('https://translate.argosopentech.com/translate', {
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
      throw new Error(`LibreTranslate API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const translatedText = data.translatedText || text;

    return NextResponse.json({ 
      originalText: text,
      translatedText: translatedText,
      target: target 
    });

  } catch (error: any) {
    console.error('Translation API error:', error);
    
    // Return original text if translation fails
    const { text } = await request.json().catch(() => ({ text: '' }));
    
    return NextResponse.json({ 
      originalText: text,
      translatedText: text, // Fallback to original text
      target: 'kn',
      error: error.message 
    }, { status: 500 });
  }
}
