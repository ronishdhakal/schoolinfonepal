export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export const fetchSchools = async () => {
  const res = await fetch(`${API_BASE_URL}/schools/`);
  if (!res.ok) throw new Error("Failed to fetch schools");
  return res.json();
};
