import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/layout/Navbar";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { dark } from "@clerk/themes";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Tape Chart | Institutional AI Quant Terminal",
  description: "Advanced algorithmic trading terminal powered by Smart Money Concepts, ICT methodologies, and Gemini AI. Real-time screening, options chains, and quantitative analysis.",
  keywords: ["Smart Money Concepts", "ICT", "Algorithmic Trading", "Quant", "AI Trading", "Options Chain", "Nifty", "BankNifty"],
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    type: "website",
    locale: "en_IN",
    url: "https://thetapechart.vercel.app",
    siteName: APP_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,

  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isClerkEnabled = 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder") && 
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("YWxwaGFlZGdl") &&
    process.env.CLERK_SECRET_KEY &&
    !process.env.CLERK_SECRET_KEY.includes("placeholder");

  const layoutContent = (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans relative">
        <div className="grid-background" />
            <Navbar />
            {children}
            <CookieConsent />
      </body>
    </html>
  );

  if (isClerkEnabled) {
    return (
      <ClerkProvider
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: "#3B82F6",
            colorBackground: "#111113",
            colorText: "#FAFAFA",
            colorTextSecondary: "#A1A1AA",
            colorInputBackground: "#18181B",
            colorInputText: "#FAFAFA",
          },
          elements: {
            headerTitle: "!text-white",
            headerSubtitle: "!text-gray-400",
            socialButtonsBlockButtonText: "!text-gray-300 !font-medium",
            formFieldLabel: "!text-gray-300",
            dividerText: "!text-gray-500",
            footerActionText: "!text-gray-400",
            identityPreviewText: "!text-gray-300",
            formButtonPrimary: "!text-white",
            userPreviewMainIdentifier: "!text-white !font-semibold",
            userPreviewSecondaryIdentifier: "!text-gray-400",
            userButtonPopoverActionButtonText: "!text-gray-300",
            userButtonPopoverActionButtonIcon: "!text-gray-400",
          }
        }}
      >
        {layoutContent}
      </ClerkProvider>
    );
  }

  return layoutContent;
}
