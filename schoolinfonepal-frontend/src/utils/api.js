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

  return res.json()
}

export async function login(email, password) {
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

  return res.json()
}

export function saveAuthToken(access, refresh, userData = null) {
  if (typeof window !== "undefined") {
    localStorage.setItem("access", access)
    localStorage.setItem("refresh", refresh)
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData))
    }
  }
}

export function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access")
  }
  return null
}

export function getUserData() {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user")
    return userData ? JSON.parse(userData) : null
  }
  return null
}

// ✅ FIXED: Proper auth headers function
export function getAuthHeaders() {
  const token = getAuthToken()
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      }
}

// ✅ FIXED: Separate function for FormData requests
export function getTokenHeaders() {
  const token = getAuthToken()
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {}
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }
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
// 📧 Inquiry APIs (Admin)
// ========================

export const fetchAdminInquiries = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/inquiries/admin/inquiries/`)
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== "") {
      url.searchParams.append(key, params[key])
    }
  })

  const headers = getAuthHeaders()
  const res = await fetch(url, { headers })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    throw new Error("Failed to fetch inquiries")
  }
  return res.json()
}

export const fetchAdminPreRegistrations = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/inquiries/admin/pre-registrations/`)
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== "") {
      url.searchParams.append(key, params[key])
    }
  })

  const headers = getAuthHeaders()
  const res = await fetch(url, { headers })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    throw new Error("Failed to fetch pre-registrations")
  }
  return res.json()
}

export const fetchInquiryAnalytics = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/inquiries/admin/analytics/`)
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== "") {
      url.searchParams.append(key, params[key])
    }
  })

  const headers = getAuthHeaders()
  const res = await fetch(url, { headers })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    throw new Error("Failed to fetch analytics")
  }
  return res.json()
}

export const exportInquiriesCSV = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/inquiries/admin/export/`)
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== "") {
      url.searchParams.append(key, params[key])
    }
  })

  const headers = getTokenHeaders()
  const res = await fetch(url, { headers })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    throw new Error("Failed to export data")
  }

  // Handle file download
  const blob = await res.blob()
  const downloadUrl = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = downloadUrl
  link.download = `inquiries_export_${new Date().toISOString().split("T")[0]}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(downloadUrl)
}

// ========================
// 🏫 School APIs
// ========================

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
  const headers = getTokenHeaders()
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
  const headers = getTokenHeaders()
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
  const headers = getTokenHeaders()
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
// 🏫 School Dashboard APIs
// ========================

// ✅ FIXED: Correct endpoint for school own profile
export const fetchSchoolOwnProfile = async () => {
  const headers = getAuthHeaders()
  const res = await fetch(`${API_BASE_URL}/schools/me/`, {
    headers,
  })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    throw new Error("Failed to fetch profile")
  }
  return res.json()
}

export const updateSchoolOwnProfile = async (formData) => {
  const headers = getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/schools/me/update/`, {
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

// ---- SCHOOL INQUIRIES ----
export const fetchSchoolInquiries = async () => {
  const headers = getAuthHeaders()
  const res = await fetch(`${API_BASE_URL}/schools/me/inquiries/`, {
    headers,
  })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    throw new Error("Failed to fetch inquiries")
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
  const headers = getTokenHeaders()
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
  const headers = getTokenHeaders()
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
  const headers = getTokenHeaders()
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
  const headers = getTokenHeaders()
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
  const headers = getTokenHeaders()
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
  const headers = getTokenHeaders()
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
  const headers = getTokenHeaders()
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
  const headers = getTokenHeaders()
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
  const headers = getTokenHeaders()
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
  const headers = getTokenHeaders()
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
  const headers = getAuthHeaders()
  const res = await fetch(`${API_BASE_URL}/disciplines/${slug}/delete/`, {
    method: "DELETE",
    headers,
  })

  if (!res.ok) {
    throw new Error("Delete failed")
  }
  return res.json()
}

// ========================
// 📅 Event APIs
// ========================

export const fetchEvents = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/events/`)
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]))
  const res = await fetch(url)
  return res.json()
}

export const fetchEventBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/events/${slug}/`)
  return res.json()
}

// ---- CREATE EVENT ----
export const createEvent = async (formData) => {
  const headers = getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/events/create/`, {
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

// ---- UPDATE EVENT ----
export const updateEvent = async (slug, formData) => {
  const headers = getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/events/${slug}/update/`, {
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

// ---- DELETE EVENT ----
export const deleteEvent = async (slug) => {
  const headers = getAuthHeaders()
  const res = await fetch(`${API_BASE_URL}/events/${slug}/delete/`, {
    method: "DELETE",
    headers,
  })

  if (!res.ok) {
    throw new Error("Delete failed")
  }
  return res.json()
}

// ========================
// 📰 Information APIs
// ========================

export const fetchInformation = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/information/`)
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]))
  const res = await fetch(url)
  return res.json()
}

export const fetchInformationBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/information/${slug}/`)
  return res.json()
}

// ---- CREATE INFORMATION ----
export const createInformation = async (formData) => {
  const headers = getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/information/create/`, {
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

// ---- UPDATE INFORMATION ----
export const updateInformation = async (slug, formData) => {
  const headers = getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/information/${slug}/update/`, {
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

// ---- DELETE INFORMATION ----
export const deleteInformation = async (slug) => {
  const headers = getAuthHeaders()
  const res = await fetch(`${API_BASE_URL}/information/${slug}/delete/`, {
    method: "DELETE",
    headers,
  })

  if (!res.ok) {
    throw new Error("Delete failed")
  }
  return res.json()
}

// ========================
// 📂 Information Categories APIs
// ========================

export const fetchInformationCategories = async () => {
  const res = await fetch(`${API_BASE_URL}/information/categories/dropdown/`)
  if (!res.ok) {
    throw new Error("Failed to fetch information categories")
  }
  return res.json()
}

export const fetchInformationCategoryBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/information/categories/${slug}/`)
  if (!res.ok) {
    throw new Error("Failed to fetch information category")
  }
  return res.json()
}

export const createInformationCategory = async (categoryData) => {
  const headers = getAuthHeaders()

  const res = await fetch(`${API_BASE_URL}/information/categories/create/`, {
    method: "POST",
    headers,
    body: JSON.stringify(categoryData),
  })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    const error = await res.json()
    throw new Error(error?.detail || "Create category failed")
  }
  return res.json()
}

export const updateInformationCategory = async (slug, categoryData) => {
  const headers = getAuthHeaders()

  const res = await fetch(`${API_BASE_URL}/information/categories/${slug}/update/`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(categoryData),
  })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    const error = await res.json()
    throw new Error(error?.detail || "Update category failed")
  }
  return res.json()
}

export const deleteInformationCategory = async (slug) => {
  const headers = getAuthHeaders()
  const res = await fetch(`${API_BASE_URL}/information/categories/${slug}/delete/`, {
    method: "DELETE",
    headers,
  })

  if (!res.ok) {
    throw new Error("Delete category failed")
  }
  return res.json()
}

// ========================
// 🎓 Scholarship APIs
// ========================

export const fetchScholarships = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/scholarships/`)
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]))
  const res = await fetch(url)
  return res.json()
}

export const fetchScholarshipBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/scholarships/${slug}/`)
  return res.json()
}

// ---- CREATE SCHOLARSHIP ----
export const createScholarship = async (formData) => {
  const headers = getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/scholarships/create/`, {
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

// ---- UPDATE SCHOLARSHIP ----
export const updateScholarship = async (slug, formData) => {
  const headers = getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/scholarships/${slug}/update/`, {
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

// ---- DELETE SCHOLARSHIP ----
export const deleteScholarship = async (slug) => {
  const headers = getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/scholarships/${slug}/delete/`, {
    method: "DELETE",
    headers,
  })

  if (!res.ok) {
    throw new Error("Delete failed")
  }
  return res.json()
}

// ========================
// 🏙️ District APIs
// ========================

export const fetchDistricts = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/districts/`)
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]))
  const res = await fetch(url)
  return res.json()
}

export const fetchDistrictBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/districts/${slug}/`)
  return res.json()
}

// ---- CREATE DISTRICT ----
export const createDistrict = async (formData) => {
  const headers = getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/districts/create/`, {
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

// ---- UPDATE DISTRICT ----
export const updateDistrict = async (slug, formData) => {
  const headers = getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/districts/${slug}/update/`, {
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

// ---- DELETE DISTRICT ----
export const deleteDistrict = async (slug) => {
  const headers = getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/districts/${slug}/delete/`, {
    method: "DELETE",
    headers,
  })

  if (!res.ok) {
    throw new Error("Delete failed")
  }
  return res.json()
}

// ========================
// 🏢 Facility APIs
// ========================

export const fetchFacilities = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/facilities/`)
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]))
  const res = await fetch(url)
  return res.json()
}

export const fetchFacilityBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/facilities/${slug}/`)
  return res.json()
}

// ---- CREATE FACILITY ----
export const createFacility = async (formData) => {
  const headers = getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/facilities/create/`, {
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

// ---- UPDATE FACILITY ----
export const updateFacility = async (slug, formData) => {
  const headers = getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/facilities/${slug}/update/`, {
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

// ---- DELETE FACILITY ----
export const deleteFacility = async (slug) => {
  const headers = getAuthHeaders()
  const res = await fetch(`${API_BASE_URL}/facilities/${slug}/delete/`, {
    method: "DELETE",
    headers,
  })

  if (!res.ok) {
    throw new Error("Delete failed")
  }
  return res.json()
}

// ========================
// 📊 Level APIs
// ========================

export const fetchLevels = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/levels/`)
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]))
  const res = await fetch(url)
  return res.json()
}

export const fetchLevelBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/levels/${slug}/`)
  return res.json()
}

// ---- CREATE LEVEL ----
export const createLevel = async (formData) => {
  const headers = getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/levels/create/`, {
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

// ---- UPDATE LEVEL ----
export const updateLevel = async (slug, formData) => {
  const headers = getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/levels/${slug}/update/`, {
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

// ---- DELETE LEVEL ----
export const deleteLevel = async (slug) => {
  const headers = getAuthHeaders()
  const res = await fetch(`${API_BASE_URL}/levels/${slug}/delete/`, {
    method: "DELETE",
    headers,
  })

  if (!res.ok) {
    throw new Error("Delete failed")
  }
  return res.json()
}

// ========================
// 🏷️ Type APIs
// ========================

export const fetchTypes = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/types/`)
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]))
  const res = await fetch(url)
  return res.json()
}

export const fetchTypeBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/types/${slug}/`)
  return res.json()
}

// ---- CREATE TYPE ----
export const createType = async (formData) => {
  const headers = getAuthHeaders()

  const res = await fetch(`${API_BASE_URL}/types/create/`, {
    method: "POST",
    headers,
    body: JSON.stringify(formData),
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

// ---- UPDATE TYPE ----
export const updateType = async (slug, formData) => {
  const headers = getAuthHeaders()

  const res = await fetch(`${API_BASE_URL}/types/${slug}/update/`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(formData),
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

// ---- DELETE TYPE ----
export const deleteType = async (slug) => {
  const headers = getAuthHeaders()
  const res = await fetch(`${API_BASE_URL}/types/${slug}/delete/`, {
    method: "DELETE",
    headers,
  })

  if (!res.ok) {
    throw new Error("Delete failed")
  }
  return res.json()
}
