'use client';

import { useEffect } from 'react';

export default function ScriptLoader() {
  useEffect(() => {
    // Only load material-dashboard.min.js from CDN if needed for admin features
    // This is optional and gracefully fails if CDN is unavailable
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/material-dashboard/2.1.2/js/material-dashboard.min.js';
    script.async = true;
    script.onerror = () => {
      console.warn('Material Dashboard script could not be loaded from CDN (optional)');
    };
    
    // Only append if not already loaded
    const existingScript = document.querySelector('script[src*="material-dashboard"]');
    if (!existingScript) {
      document.body.appendChild(script);
    }

    return () => {
      // Cleanup script if component unmounts
      const scriptToRemove = document.querySelector('script[src*="material-dashboard"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return null;
}
