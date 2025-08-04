import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { TranslationProvider } from '../contexts/TranslationContext';
import StyledComponentsRegistry from '../lib/registry';
import ScriptLoader from "./scripts"; // Correct usage
import { Analytics } from '@vercel/analytics/react';

// app/page.tsx or app/home/page.tsx
export const metadata = {
  title: "Home",
  description: "Welcome to Christ College - Empowering students through education.",
  keywords: ["Christ College", "Education", "Admissions", "Bangalore", "UG", "PG"],
  openGraph: {
    title: "Christ College",
    description: "Explore courses and opportunities at Christ College, Bangalore.",
    url: "https://christcollege.edu.in",
    siteName: "Christ College",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christ College",
    description: "Top-ranked college in Bangalore offering UG & PG courses.",
  },
  alternates: {
    canonical: "https://christcollege.edu.in/",
  },
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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900|Roboto+Slab:400,700"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <TranslationProvider>
              <AuthProvider>
                {children}
                <ScriptLoader /> {/* Load JS libs after page render */}
                <Analytics />
              </AuthProvider>
            </TranslationProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
