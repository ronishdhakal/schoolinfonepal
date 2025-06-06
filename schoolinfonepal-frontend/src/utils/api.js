export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

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
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error?.detail || "Login failed")
  }

  return res.json() // { access, refresh, role, ... }
}

export function saveAuthToken(access, refresh) {
  if (typeof window !== "undefined") {
    localStorage.setItem("access", access)
    localStorage.setItem("refresh", refresh)
  }
}

export function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access")
  }
  return null
}

// ✅ Simple: only gets the current token
export function getAuthHeaders() {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function logout() {
  localStorage.removeItem("access")
  localStorage.removeItem("refresh")
  window.location.href = "/login"
}

// ========================
// 📍 Dropdown Fetchers (Public)
// ========================

const get = async (url) => (await fetch(`${API_BASE_URL}${url}`)).json()

export const fetchDistrictsDropdown = () => get("/districts/dropdown/")
export const fetchUniversitiesDropdown = () => get("/universities/dropdown/")
export const fetchLevelsDropdown = () => get("/levels/dropdown/")
export const fetchTypesDropdown = () => get("/types/dropdown/")
export const fetchCoursesDropdown = () => get("/courses/dropdown/")
export const fetchFacilitiesDropdown = () => get("/facilities/dropdown/")
export const fetchDisciplinesDropdown = () => get("/disciplines/dropdown/")
export const fetchSchoolsDropdown = () => get("/schools/dropdown/")

// ========================
// 🏫 School APIs
// ========================

// Helper: async headers for FormData requests (no Content-Type)
async function getTokenHeaders() {
  const headers = await getAuthHeaders()
  if (headers["Content-Type"]) delete headers["Content-Type"]
  return headers
}

export const fetchSchools = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/schools/`)
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]))
  const res = await fetch(url)
  return res.json()
}

export const fetchSchoolBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/schools/${slug}/`)
  return res.json()
}

// ---- CREATE SCHOOL ----
export const createSchool = async (formData) => {
  const headers = await getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/schools/create/`, {
    method: "POST",
    headers,
    body: formData,
  })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    const error = await res.json()
    throw new Error(error?.detail || "Create failed")
  }
  return res.json()
}

// ---- UPDATE SCHOOL ----
export const updateSchool = async (slug, formData) => {
  const headers = await getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/schools/${slug}/update/`, {
    method: "PATCH",
    headers,
    body: formData,
  })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    const error = await res.json()
    throw new Error(error?.detail || "Update failed")
  }
  return res.json()
}

// ---- DELETE SCHOOL ----
export const deleteSchool = async (slug) => {
  const headers = await getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/schools/${slug}/delete/`, {
    method: "DELETE",
    headers,
  })

  if (!res.ok) {
    throw new Error("Delete failed")
  }
  return res.json()
}

// ========================
// 📚 Course APIs
// ========================

export const fetchCourses = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/courses/`)
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]))
  const res = await fetch(url)
  return res.json()
}

export const fetchCourseBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/courses/${slug}/`)
  return res.json()
}

// ---- CREATE COURSE ----
export const createCourse = async (formData) => {
  const headers = await getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/courses/create/`, {
    method: "POST",
    headers,
    body: formData,
  })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    const error = await res.json()
    throw new Error(error?.detail || "Create failed")
  }
  return res.json()
}

// ---- UPDATE COURSE ----
export const updateCourse = async (slug, formData) => {
  const headers = await getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/courses/${slug}/update/`, {
    method: "PATCH",
    headers,
    body: formData,
  })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    const error = await res.json()
    throw new Error(error?.detail || "Update failed")
  }
  return res.json()
}

// ---- DELETE COURSE ----
export const deleteCourse = async (slug) => {
  const headers = await getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/courses/${slug}/delete/`, {
    method: "DELETE",
    headers,
  })

  if (!res.ok) {
    throw new Error("Delete failed")
  }
  return res.json()
}

// ========================
// 🏛️ University APIs
// ========================

export const fetchUniversities = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/universities/`)
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]))
  const res = await fetch(url)
  return res.json()
}

export const fetchUniversityBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/universities/${slug}/`)
  return res.json()
}

// ---- CREATE UNIVERSITY ----
export const createUniversity = async (formData) => {
  const headers = await getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/universities/create/`, {
    method: "POST",
    headers,
    body: formData,
  })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    const error = await res.json()
    throw new Error(error?.detail || "Create failed")
  }
  return res.json()
}

// ---- UPDATE UNIVERSITY ----
export const updateUniversity = async (slug, formData) => {
  const headers = await getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/universities/${slug}/update/`, {
    method: "PATCH",
    headers,
    body: formData,
  })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    const error = await res.json()
    throw new Error(error?.detail || "Update failed")
  }
  return res.json()
}

// ---- DELETE UNIVERSITY ----
export const deleteUniversity = async (slug) => {
  const headers = await getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/universities/${slug}/delete/`, {
    method: "DELETE",
    headers,
  })

  if (!res.ok) {
    throw new Error("Delete failed")
  }
  return res.json()
}

// ========================
// 📢 Advertisement APIs
// ========================

export const fetchAdvertisements = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/ads/`)
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]))
  const res = await fetch(url)
  return res.json()
}

export const fetchAdvertisementById = async (id) => {
  const headers = getAuthHeaders()
  const res = await fetch(`${API_BASE_URL}/ads/${id}/`, {
    headers,
  })
  return res.json()
}

// ---- CREATE ADVERTISEMENT ----
export const createAdvertisement = async (formData) => {
  const headers = await getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/ads/create/`, {
    method: "POST",
    headers,
    body: formData,
  })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    const error = await res.json()
    throw new Error(error?.detail || "Create failed")
  }
  return res.json()
}

// ---- UPDATE ADVERTISEMENT ----
export const updateAdvertisement = async (id, formData) => {
  const headers = await getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/ads/${id}/update/`, {
    method: "PATCH",
    headers,
    body: formData,
  })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    const error = await res.json()
    throw new Error(error?.detail || "Update failed")
  }
  return res.json()
}

// ---- DELETE ADVERTISEMENT ----
export const deleteAdvertisement = async (id) => {
  const headers = getAuthHeaders()
  const res = await fetch(`${API_BASE_URL}/ads/${id}/delete/`, {
    method: "DELETE",
    headers,
  })

  if (!res.ok) {
    throw new Error("Delete failed")
  }
  return res.json()
}

// ========================
// 📚 Discipline APIs
// ========================

export const fetchDisciplines = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/disciplines/`)
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]))
  const res = await fetch(url)
  return res.json()
}

export const fetchDisciplineBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/disciplines/${slug}/`)
  return res.json()
}

// ---- CREATE DISCIPLINE ----
export const createDiscipline = async (formData) => {
  const headers = await getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/disciplines/create/`, {
    method: "POST",
    headers,
    body: formData,
  })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    const error = await res.json()
    throw new Error(error?.detail || "Create failed")
  }
  return res.json()
}

// ---- UPDATE DISCIPLINE ----
export const updateDiscipline = async (slug, formData) => {
  const headers = await getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/disciplines/${slug}/update/`, {
    method: "PATCH",
    headers,
    body: formData,
  })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    const error = await res.json()
    throw new Error(error?.detail || "Update failed")
  }
  return res.json()
}

// ---- DELETE DISCIPLINE ----
export const deleteDiscipline = async (slug) => {
  const headers = await getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/disciplines/${slug}/delete/`, {
    method: "DELETE",
    headers,
  })

  if (!res.ok) {
    throw new Error("Delete failed")
  }
  return res.json()
}
