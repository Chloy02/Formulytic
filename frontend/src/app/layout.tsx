import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { TranslationProvider } from '../contexts/TranslationContext';
import StyledComponentsRegistry from '../lib/registry';

export const metadata: Metadata = {
  title: "Formulytcs",
  description: "Advanced form analytics and questionnaire platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Fonts and icons */}
        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900|Roboto+Slab:400,700" />
        {/* Font Awesome Icons */}
        <script src="https://kit.fontawesome.com/42d5adcbca.js" crossOrigin="anonymous" async></script>
        {/* Material Icons */}
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
      </head>
      
      {/* These classes on the body tag are CRITICAL for the theme's layout and styling */}
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <TranslationProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </TranslationProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>

        {/* Core JS Files */}
        <Script src="/assets/js/core/popper.min.js" />
        <Script src="/assets/js/core/bootstrap.min.js" />
        <Script src="/assets/js/plugins/perfect-scrollbar.min.js" />
        <Script src="/assets/js/plugins/smooth-scrollbar.min.js" />
        
        {/* Control Center for Material Dashboard: parallax effects, scripts for the example pages etc */}
        <Script src="/assets/js/material-dashboard.min.js?v=3.1.0" />
      </body>
    </html>
  );
}
