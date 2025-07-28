import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, target = 'kn' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Only try Microsoft Translator API if credentials are available
    const microsoftKey = process.env.MICROSOFT_TRANSLATOR_KEY;
    const microsoftRegion = process.env.MICROSOFT_TRANSLATOR_REGION;
    
    if (microsoftKey && microsoftKey.trim() !== '') {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const route = `/translate?api-version=3.0&from=en&to=${target}`;
        const endpoint = 'https://api.cognitive.microsofttranslator.com';
        const requestBody = [{ Text: text }];

        const response = await fetch(endpoint + route, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': microsoftKey,
            'Ocp-Apim-Subscription-Region': microsoftRegion || ''
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const translatedText = data[0]?.translations[0]?.text || text;
          
          return NextResponse.json({ 
            originalText: text,
            translatedText: translatedText,
            target: target,
            service: 'microsoft'
          });
        } else {
          console.warn(`Microsoft Translator failed: ${response.status} ${response.statusText}`);
        }
      } catch (microsoftError) {
        console.warn('Microsoft Translator error:', microsoftError);
      }
    }

    // No translation service available - return original text
    console.log('No translation service available, returning original text for:', text);
    
    return NextResponse.json({ 
      originalText: text,
      translatedText: text, // Return original text as fallback
      target: target,
      service: 'none'
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
