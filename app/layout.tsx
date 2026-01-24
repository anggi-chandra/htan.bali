import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";
import LoadingScreen from "./components/LoadingScreen";
import { LoadingProvider } from "./context/LoadingContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HTan.Bali",
  description: "Premium rental equipment for events in Bali",
  icons: {
    icon: '/logo_htan.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <LoadingProvider>
            <LoadingScreen />
            {children}
            <CartDrawer />
          </LoadingProvider>
        </CartProvider>
      </body>
    </html>
  );
}
