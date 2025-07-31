import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { TranslationProvider } from '../contexts/TranslationContext';
import StyledComponentsRegistry from '../lib/registry';
import ScriptLoader from "./scripts"; // <— add this

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
        {/* Font Awesome CDN can fail — optional: use npm instead */}
      </head>
      <body suppressHydrationWarning={true}>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <TranslationProvider>
              <AuthProvider>
                {children}
                <ScriptLoader /> {/* Load JS libs after page render */}
              </AuthProvider>
            </TranslationProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
