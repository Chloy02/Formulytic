'use client';

import { useEffect } from 'react';

export default function ScriptLoader() {
  useEffect(() => {
    const loadScript = () => {
      if (document.querySelector('script[src*="material-dashboard"]')) return;

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/material-dashboard/2.1.2/js/material-dashboard.min.js';
      script.async = true;
      script.defer = true;

      script.onerror = () => {
        console.warn('Material Dashboard script failed to load.');
      };

      document.body.appendChild(script);
    };

    // Use requestIdleCallback if available, otherwise fallback
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadScript);
    } else {
      setTimeout(loadScript, 1000); // fallback delay
    }

    return () => {
      const scriptTag = document.querySelector('script[src*="material-dashboard"]');
      if (scriptTag) scriptTag.remove();
    };
  }, []);

  return null;
}
