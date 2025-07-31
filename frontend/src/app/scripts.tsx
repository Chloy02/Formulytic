'use client';

import { useEffect } from 'react';

export default function ScriptLoader() {
  useEffect(() => {
    // Bootstrap
    import('bootstrap');

    // Perfect Scrollbar
    import('perfect-scrollbar').then(({ default: PerfectScrollbar }) => {
      const el = document.querySelector('#main-content');
      if (el) new PerfectScrollbar(el);
    });

    // Smooth Scrollbar
    import('smooth-scrollbar').then(({ default: Scrollbar }) => {
      const el = document.querySelector('#main-content');
      if (el) Scrollbar.init(el);
    });

    // Optional: Load Material Dashboard manually if needed
    // NOTE: You need to add this file to `public/assets/js/material-dashboard.min.js`
    const script = document.createElement('script');
    script.src = '/assets/js/material-dashboard.min.js?v=3.1.0';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
