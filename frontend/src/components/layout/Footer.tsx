import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1">
          <h3 className="font-heading text-white text-lg mb-2">
            Rockshairmpire
          </h3>
          <p className="text-gray-400 text-xs">
            Rock every hair with confidence.{" "}
          </p>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3">Shop</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/products" className="hover:text-white">
                All Products
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3">Account</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/orders" className="hover:text-white">
                My Orders
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-white">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3">Contact</h4>
          <p className="text-gray-400 text-xs">support@rockshairmpire.com</p>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Rockshairmpire. All rights reserved.
      </div>
    </footer>
  );
}
