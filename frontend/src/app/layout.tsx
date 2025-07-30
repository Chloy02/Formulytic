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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900|Roboto+Slab:400,700" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"
        />
      </head>
      <body suppressHydrationWarning={true}>
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
        <Script src="/assets/js/core/popper.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/core/bootstrap.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/plugins/perfect-scrollbar.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/plugins/smooth-scrollbar.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/material-dashboard.min.js?v=3.1.0" strategy="lazyOnload" />
      </body>
    </html>
  );
}
