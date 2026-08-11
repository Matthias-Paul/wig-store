import { Navbar } from "@/src/components/layout/Navbar";
import { Footer } from "@/src/components/layout/Footer";
import { CartDrawer } from "@/src/features/cart/components/CartDrawer";
import { CartDrawerProvider } from "@/src/features/cart/CartDrawerContext";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <CartDrawerProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </CartDrawerProvider>
    </div>
  );
}
