"use client";
import React from "react";

const UniversityAbout = ({ university }) => {
  if (!university || !university.about) return null;

  return (
    <section className="bg-white rounded-2xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">About {university.name}</h2>
      <div className="prose max-w-none text-gray-800 leading-relaxed">
        {/* If about contains HTML, render as HTML; otherwise, as plain text */}
        {/<[a-z][\s\S]*>/i.test(university.about) ? (
          <div dangerouslySetInnerHTML={{ __html: university.about }} />
        ) : (
          <p>{university.about}</p>
        )}
      </div>
    </section>
  );
};

export default UniversityAbout;
