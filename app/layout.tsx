import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PreviewPlayer from "@/components/PreviewPlayer";
import { PlayerProvider } from "@/lib/player-context";
import { CartProvider } from "@/lib/cart-context";
import BootLoader from "@/components/BootLoader";
import PageTransition from "@/components/PageTransition";
import PromoPopup from "@/components/PromoPopup";

// NOTE: This project originally used next/font/google for Space Grotesk +
// JetBrains Mono. The sandbox used to build this prototype can't reach
// fonts.googleapis.com, so font loading was moved to a CSS @import in
// globals.css (with a system-font fallback) to keep the build working
// everywhere. Once you run this locally or deploy to Vercel — where you'll
// have full internet access — feel free to switch back to next/font/google
// for better performance (it self-hosts the font files at build time).

export const metadata: Metadata = {
  title: "AETRIS / LAB — sounds for producers",
  description:
    "Drum kits, sample packs and bundles built for trap and r&b producers who don't settle for filler.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <BootLoader />
          <PromoPopup />
          <PlayerProvider>
            <div className="bg-grid" />
            <Header />
            {/* pb-24 leaves room at the bottom so the sticky player never covers content */}
            <main className="relative z-10 pb-24">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <PreviewPlayer />
          </PlayerProvider>
        </CartProvider>
      </body>
    </html>
  );
}
