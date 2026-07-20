import React from "react";
import { FileText } from "lucide-react";

export default function SearchResults({
  results,
  loading,
  query,
}) {
  if (!query.trim()) return null;

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500">
        Searching enterprise knowledge...
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-semibold text-slate-700">
          No results found
        </h3>

        <p className="mt-2 text-slate-500">
          Try searching for another document or keyword.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      <h2 className="text-xl font-semibold">
        Search Results
      </h2>

      {results.map((result) => (
        <div
          key={result.id}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
        >
          <div className="flex justify-between">

            <div className="flex gap-3">

              <FileText
                className="text-primary mt-1"
                size={20}
              />

              <div>

                <h3 className="font-semibold">
                  {result.metadata?.source}
                </h3>

                <p className="text-sm text-slate-500">
                  Page {result.metadata?.page}
                </p>

              </div>

            </div>

            <span className="font-semibold text-green-600">
              {result.score}% Match
            </span>

          </div>

          <p className="mt-4 text-slate-700 line-clamp-3">
            {result.text}
          </p>

        </div>
      ))}

    </div>
  );
}