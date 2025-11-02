import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import "./animations.css";
import { Providers } from "./providers"; // Import Providers
import CookieBanner from "@/components/CookieBanner";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthStatus from '@/components/AuthStatus'; // Import AuthStatus



async function getSettings() {
  try {
    const res = await fetch(new URL('/api/settings/theme', process.env.NEXT_PUBLIC_BACKEND_URL).toString());
    if (!res.ok) {
      console.error('Failed to fetch settings:', res.status, res.statusText);
      return null;
    }
    return res.json();
  } catch (error: any) {
    console.error('Error fetching settings for metadata:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  const faviconUrl = settings?.faviconUrl 
    ? settings.faviconUrl.startsWith('http') 
      ? settings.faviconUrl 
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}${settings.faviconUrl}` 
    : "/favicon.ico";

  const metaLogoUrl = settings?.metaLogoUrl
    ? settings.metaLogoUrl.startsWith('http')
      ? settings.metaLogoUrl
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}${settings.metaLogoUrl}`
    : null;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: settings?.metaTitle || "My Affiliate App",
    description: settings?.metaDescription || "A powerful affiliate marketing platform.",
    icons: {
      icon: faviconUrl,
    },
    openGraph: {
      images: metaLogoUrl ? [metaLogoUrl] : [],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers> {/* Use Providers instead of SessionProvider */}
          <Header />
          {children}
          <Footer />
          <AuthStatus /> {/* Render AuthStatus */}
        </Providers>
        <CookieBanner />
      </body>
    </html>
  );
}