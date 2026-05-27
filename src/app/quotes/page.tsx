"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Quote {
  id: string;
  quoteName: string;
  customerName: string;
  total: number;
  product: { name: string };
  tier: { name: string };
  createdAt: string;
}

export default function QuotesListPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const res = await fetch("/api/quotes");
      setQuotes(await res.json());
    } catch (error) {
    //   alert("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Quotes</h1>
            <p className="text-gray-600">
              Manage and view all created quotes
            </p>
          </div>
          <Link
            href="/quotes/new"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            + Create New Quote
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading quotes...</div>
        ) : quotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 mb-4">No quotes yet</p>
            <Link
              href="/quotes/new"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition inline-block"
            >
              Create Your First Quote
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Quote Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {quote.quoteName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {quote.customerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {quote.product?.name} - {quote.tier?.name}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${quote.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/quotes/${quote.id}`}
                        className="text-indigo-600 hover:text-indigo-900 font-semibold text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
