"use client";
import React from "react";

const UniversitySalientFeatures = ({ university }) => {
  if (!university || !university.salient_features) return null;

  // Try splitting salient_features into bullet points if stored as plain text (optional)
  const features = university.salient_features
    .split(/\r?\n|•/g)
    .map(f => f.trim())
    .filter(f => f.length > 0);

  return (
    <section className="bg-white rounded-2xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Salient Features</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        {features.length > 0 ? (
          features.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))
        ) : (
          <li className="text-gray-400">No features listed.</li>
        )}
      </ul>
    </section>
  );
};

export default UniversitySalientFeatures;
