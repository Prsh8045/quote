import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Monetizely - Quoting Tool",
  description: "Professional SaaS pricing and quoting tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">
                <Link href="/" className="hover:text-indigo-400 transition">
                  Monetizely
                </Link>
              </div>

              <div className="flex gap-8">
                <Link
                  href="/"
                  className="hover:text-indigo-400 transition font-semibold"
                >
                  Home
                </Link>

                <div className="relative group">
                  <button className="hover:text-indigo-400 transition font-semibold">
                    Catalog
                  </button>

                  <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      href="/catalog/products"
                      className="block px-4 py-2 hover:bg-gray-700 first:rounded-t-lg"
                    >
                      Products
                    </Link>

                    <Link
                      href="/catalog/features"
                      className="block px-4 py-2 hover:bg-gray-700"
                    >
                      Features
                    </Link>

                    <Link
                      href="/catalog/tiers"
                      className="block px-4 py-2 hover:bg-gray-700"
                    >
                      Tiers
                    </Link>

                    <Link
                      href="/catalog/tier-features"
                      className="block px-4 py-2 hover:bg-gray-700 last:rounded-b-lg"
                    >
                      Configure Features
                    </Link>
                  </div>
                </div>

                <Link
                  href="/quotes"
                  className="hover:text-indigo-400 transition font-semibold"
                >
                  Quotes
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}