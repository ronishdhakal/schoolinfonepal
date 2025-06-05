import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

// ========================
// 🔐 Authentication
// ========================

export async function loginSuperadmin(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.detail || "Login failed");
  }

  return res.json(); // Should return { access, refresh, role, ... }
}

export function saveAuthToken(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("access", token); // ✅ consistent key
  }
}

export function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access"); // ✅ fixed to match
  }
  return null;
}

export function getAuthHeaders() {
  const token = getAuthToken();
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access");
    window.location.href = "/login";
  }
}

// ========================
// 📍 Dropdown Fetchers (Public)
// ========================

export const fetchDistrictsDropdown = async () => {
  const res = await axios.get(`${API_BASE_URL}/districts/dropdown/`);
  return res.data;
};

export const fetchUniversitiesDropdown = async () => {
  const res = await axios.get(`${API_BASE_URL}/universities/dropdown/`);
  return res.data;
};

export const fetchLevelsDropdown = async () => {
  const res = await axios.get(`${API_BASE_URL}/levels/dropdown/`);
  return res.data;
};

export const fetchTypesDropdown = async () => {
  const res = await axios.get(`${API_BASE_URL}/types/dropdown/`);
  return res.data;
};

export const fetchCoursesDropdown = async () => {
  const res = await axios.get(`${API_BASE_URL}/courses/dropdown/`);
  return res.data;
};

export const fetchFacilitiesDropdown = async () => {
  const res = await axios.get(`${API_BASE_URL}/facilities/dropdown/`);
  return res.data;
};

export const fetchDisciplinesDropdown = async () => {
  const res = await axios.get(`${API_BASE_URL}/disciplines/dropdown/`);
  return res.data;
};

export const fetchSchoolsDropdown = async () => {
  const res = await axios.get(`${API_BASE_URL}/schools/dropdown/`);
  return res.data;
};

// ========================
// 🏫 School APIs
// ========================

export const fetchSchools = async (params = {}) => {
  const res = await axios.get(`${API_BASE_URL}/schools/`, { params });
  return res.data;
};

export const fetchSchoolBySlug = async (slug) => {
  const res = await axios.get(`${API_BASE_URL}/schools/${slug}/`);
  return res.data;
};

export const createSchool = async (formData) => {
  const res = await axios.post(`${API_BASE_URL}/schools/create/`, formData, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateSchool = async (slug, formData) => {
  const res = await axios.patch(`${API_BASE_URL}/schools/${slug}/update/`, formData, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteSchool = async (slug) => {
  const res = await axios.delete(`${API_BASE_URL}/schools/delete/${slug}/`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
