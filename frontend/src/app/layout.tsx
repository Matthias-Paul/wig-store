import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import {Providers} from "./providers"
import { Toaster } from "sonner";
import { CartDrawerProvider } from "../features/cart/CartDrawerContext";
import { WhatsAppButton } from "../components/layout/WhatsAppButton";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} font-sans`}>
        <Providers>
          <CartDrawerProvider>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  fontFamily: "var(--font-inter)",
                },
              }}
            />
            <WhatsAppButton />
          </CartDrawerProvider>
        </Providers>
      </body>
    </html>
  );
}
