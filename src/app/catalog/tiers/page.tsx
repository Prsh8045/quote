import TierForm from "../../../components/forms/TierForm";

export default function TierPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Tiers</h1>
        <p className="text-gray-600 mb-8">
          Create and manage pricing tiers for your products
        </p>

        <TierForm />
      </div>
    </div>
  );
}