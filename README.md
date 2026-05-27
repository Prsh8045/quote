# Monetizely - Professional SaaS Quoting Tool

A complete SaaS pricing and quoting application built with Next.js, TypeScript, Prisma, and Tailwind CSS. Designed to help businesses design their pricing structure, configure product tiers and features, and generate professional, shareable quotes.

## Features

- **📦 Catalog Management**: Create and manage products, pricing tiers, and features
- **⚙️ Flexible Pricing**: Support for three pricing models:
  - Fixed monthly price (e.g., $200/month)
  - Per-seat pricing (e.g., $50/seat/month)
  - Percentage-based (e.g., 10% of product price)
- **💰 Smart Discounts**:
  - Automatic contract term discounts (15% annual, 25% two-year)
  - Quote-level discount application
- **📝 Quote Builder**: Multi-step wizard to create professional quotes
- **🔗 Shareable Quotes**: Public, read-only URLs (no login required)
- **📊 Transparent Math**: Clear line-item breakdowns showing all calculations
- **🎨 Beautiful UI**: Built with Tailwind CSS for modern, responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A database (PostgreSQL, SQLite, or MongoDB)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd quote
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your database URL in `.env.local`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/monetizely"
```

5. Run database migrations:
```bash
npx prisma migrate deploy
npx prisma generate
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

### 1. Set Up Your Catalog

#### Create Products
- Navigate to **Catalog → Products**
- Enter product name and create
- Products are containers for pricing tiers and features

#### Create Features
- Navigate to **Catalog → Features**
- Select a product and define feature names
- Features represent capabilities available in different tiers

#### Create Tiers
- Navigate to **Catalog → Tiers**
- Select a product, set tier name and base price
- Base price is charged per-seat, per-month

#### Configure Feature Availability
- Navigate to **Catalog → Configure Features**
- Select a tier
- For each feature, set:
  - **Included**: Feature is free with this tier
  - **Add-on**: Feature is available for extra cost
  - **Not Available**: Feature not offered on this tier
- For add-ons, specify pricing model and price

### 2. Build a Quote

- Navigate to **Quotes → Create New Quote**
- Follow the 4-step wizard:
  1. **Basic Info**: Quote name and customer name
  2. **Product & Tier**: Select product, tier, number of seats, contract term
  3. **Add-ons**: Select optional add-ons
  4. **Review**: Apply optional discount and save

### 3. Share Quotes

- Saved quotes get a unique public URL
- Share the URL with customers
- Customers can view quotes without logging in
- Quotes show clear line-item breakdown with all calculations

## Architecture

### Database Schema

```
Product
├── Tier (base price, name)
│   └── TierFeature (availability, pricing model, price)
│       └── Feature (name)
└── Feature

Quote
├── QuoteAddon (calculated price)
│   └── Feature
└── Product & Tier
```

### API Endpoints

#### Products
- `POST /api/products` - Create product
- `GET /api/products` - List products

#### Tiers
- `POST /api/tiers` - Create tier
- `GET /api/tiers` - List tiers

#### Features
- `POST /api/features` - Create feature
- `GET /api/features` - List features

#### Tier Features
- `POST /api/tier-features` - Add feature to tier
- `GET /api/tier-features` - List tier features
- `PUT /api/tier-features` - Update feature configuration

#### Quotes
- `POST /api/quotes` - Create quote
- `GET /api/quotes` - List all quotes
- `GET /api/quotes/[id]` - Get specific quote (public)

### Pricing Logic

All pricing calculations are handled by the `pricing.ts` service:

```typescript
// Calculate add-on price based on pricing model
calculateAddonPrice(addon, basePrice, seats)

// Calculate complete quote with all discounts
calculateQuoteTotal(basePrice, seats, term, addons, discountPercent)

// Generate line items for quote display
generateLineItems(product, tier, seats, term, addons, discountPercent)
```

#### Term Discounts
- **Monthly**: 0%
- **Annual**: 15% (applied to per-seat price)
- **Two-Year**: 25% (applied to per-seat price)

#### Calculation Flow
1. Base cost = `tier.basePrice * seats * (1 - termDiscount)`
2. Add-on costs calculated per pricing model
3. Subtotal = base + add-ons
4. Quote discount applied to subtotal
5. Total = subtotal - quoteDiscount

## Testing

Run all tests:
```bash
npm test
```

### Unit Tests
Tests cover:
- Fixed price add-ons
- Per-seat add-ons
- Percentage-based add-ons
- Term discounts (15% annual, 25% two-year)
- Quote-level discounts
- Complex scenarios with multiple add-ons

All pricing calculations are fully tested to ensure accuracy.

### Example Test
```typescript
it("should calculate quote with annual discount and multiple add-ons", () => {
  const addons = [
    { featureId: "sso", pricingModel: "FIXED", price: 200 },
    { featureId: "api", pricingModel: "PER_SEAT", price: 50 },
  ];
  const result = calculateQuoteTotal(100, 10, "ANNUAL", addons, 5);
  // Base: 100 * 0.85 * 10 = 850
  // SSO: 200
  // API: 50 * 10 = 500
  // Subtotal: 1550
  // Discount (5%): -77.50
  // Total: 1472.50
});
```

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your database connection string
4. Deploy

The app is optimized for Vercel's serverless environment:
- API routes as serverless functions
- Automatic deployment on git push
- Built-in edge caching

### Recommended Database Services for Vercel

- **PostgreSQL**: Vercel Postgres, Railway, Supabase
- **SQLite**: Vercel KV (embedded), Turso
- **MongoDB**: MongoDB Atlas

## Design Decisions

### 1. Pricing Model Support
**Decision**: Support three pricing models (fixed, per-seat, percentage)
**Rationale**: Covers 95% of SaaS pricing strategies. Fixed handles flat fees, per-seat handles usage-based scaling, percentage handles premium features as a markup.

### 2. Term Discounts as System-Wide Constants
**Decision**: Made discounts (15% annual, 25% two-year) non-configurable
**Rationale**: Per the spec, these are "standard terms across all clients." This simplifies UX and prevents pricing inconsistencies.

### 3. Quote-Level Discount Application
**Decision**: Applied after adding all costs (not to individual line items)
**Rationale**: Matches typical sales workflows where a single discount is negotiated on the total deal.

### 4. Public Quote URLs (No Auth)
**Decision**: Quotes accessible without login via UUID
**Rationale**: Customers should be able to view quotes without friction. UUID provides sufficient security through obscurity for a typical business use case.

### 5. No Edit/Delete After Save
**Decision**: Quotes are immutable after creation
**Rationale**: Simplifies implementation and audit trail. In real sales, new quotes are created rather than edited.

### 6. No Catalog Deletion
**Decision**: Can create and edit catalog items, but not delete
**Rationale**: Preserves historical quote integrity and prevents accidental data loss.

## Assumptions

1. **Single Currency**: USD only (per spec)
2. **No Taxes**: Prices are as-quoted (no tax calculation per spec)
3. **Monthly Billing**: All pricing is expressed per-month (annual = 12 months with discount)
4. **Seat-Based**: Primary pricing dimension is number of seats
5. **Term Lock**: Contract term cannot change mid-quote
6. **Add-on Independence**: Add-ons don't affect each other's pricing
7. **Synchronous Pricing**: All pricing is calculated in real-time, no async operations

## Questions for the Team

If I had more context, I would ask:

1. **Multi-currency Support**: Should this eventually support pricing in different currencies?
2. **Usage-Based Add-ons**: Should add-on pricing depend on usage metrics beyond seats?
3. **Custom Discounts**: Should certain add-ons have per-tier pricing variations?
4. **Quote Expiration**: Should quotes expire or have a validity period?
5. **Quote History**: Should analysts see who created/modified catalogs?
6. **Minimum Seats**: Should tiers have minimum seat requirements?
7. **Bundle Pricing**: Should there be support for package deals combining products?
8. **Renewal Pricing**: Should renewal pricing differ from initial pricing?

## What I Would Build Next

Given more time, priority additions would be:

1. **Quote Templates**: Save common quote configurations as templates
2. **PDF Export**: Generate downloadable PDF quotes
3. **Email Delivery**: Send quotes directly via email
4. **Revision History**: Track changes to quotes/catalogs
5. **User Accounts & Teams**: Multi-user support with team collaboration
6. **Advanced Analytics**: Track quote-to-deal conversion rates
7. **Quote Comments**: Internal notes on quotes
8. **Customer Portal**: Customers accept/sign quotes in-app
9. **Integration APIs**: Webhooks and API keys for CRM integration
10. **Mobile App**: React Native app for quote creation on-the-go

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Next.js API Routes, TypeScript
- **Database**: Prisma ORM (PostgreSQL/SQLite/MongoDB compatible)
- **Styling**: Tailwind CSS
- **Testing**: Vitest
- **Deployment**: Vercel

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.