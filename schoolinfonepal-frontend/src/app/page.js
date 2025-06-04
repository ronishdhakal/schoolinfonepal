"use client";
import { useEffect, useState } from "react";
import { fetchSchools } from "../utils/api";

export default function HomePage() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    fetchSchools()
      .then(setSchools)
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Schools in Nepal</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => (
          <li key={school.id} className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold">{school.name}</h2>
            <p className="text-sm text-gray-600">{school.address}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
