import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Professional Quoting Made Simple
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Design your SaaS pricing structure, configure product tiers and features,
            and generate beautiful, shareable quotes in minutes.
          </p>
          <Link
            href="/quotes/new"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-lg transition text-lg"
          >
            Create Your First Quote
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Catalog Management */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <div className="text-4xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Catalog Management
            </h2>
            <p className="text-gray-600 mb-6">
              Create products, define tiers with pricing, and configure which features
              are included or available as paid add-ons.
            </p>
            <div className="space-y-2">
              <Link
                href="/catalog/products"
                className="block text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                → Manage Products
              </Link>
              <Link
                href="/catalog/tiers"
                className="block text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                → Manage Tiers
              </Link>
              <Link
                href="/catalog/features"
                className="block text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                → Manage Features
              </Link>
              <Link
                href="/catalog/tier-features"
                className="block text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                → Configure Features
              </Link>
            </div>
          </div>

          {/* Quote Builder */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Quote Builder
            </h2>
            <p className="text-gray-600 mb-6">
              Build professional quotes with automatic pricing calculation. Select
              product, tier, add-ons, and apply custom discounts.
            </p>
            <div className="space-y-2">
              <Link
                href="/quotes/new"
                className="block text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                → Create New Quote
              </Link>
              <Link
                href="/quotes"
                className="block text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                → View All Quotes
              </Link>
            </div>
          </div>

          {/* Smart Pricing */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <div className="text-4xl mb-4">💰</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Smart Pricing
            </h2>
            <p className="text-gray-600 mb-6">
              Automatic calculation of base prices, add-ons, and discounts. Support
              for fixed, per-seat, and percentage-based pricing models.
            </p>
            <p className="text-sm text-gray-500">
              All calculations are transparent and clearly shown in quotes.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Set Up Catalog",
                description: "Create products, define tiers, add features",
              },
              {
                step: 2,
                title: "Configure Pricing",
                description: "Set feature availability and add-on prices",
              },
              {
                step: 3,
                title: "Build Quote",
                description: "Select product, tier, seats, term, and add-ons",
              },
              {
                step: 4,
                title: "Share & Close",
                description: "Send shareable quote URL to your customer",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features List */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-12 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Multiple pricing models (fixed, per-seat, percentage)",
              "Contract term discounts (15% annual, 25% two-year)",
              "Configurable product tiers and features",
              "Quote-level discount application",
              "Transparent line-item breakdown",
              "Shareable public URLs (no login needed)",
              "Automatic price calculations",
              "Clean, professional quote design",
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start">
                <span className="text-2xl mr-4">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-300 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p>
            Built with Next.js, TypeScript, Prisma, and Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
