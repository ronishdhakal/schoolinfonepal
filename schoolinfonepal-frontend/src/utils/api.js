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

const get = async (url) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const text = await response.text()
    if (!text) {
      return []
    }
    return JSON.parse(text)
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    return []
  }
}

export const fetchDistrictsDropdown = () => get("/districts/dropdown/")
export const fetchUniversitiesDropdown = () => get("/universities/dropdown/")
export const fetchLevelsDropdown = () => get("/levels/dropdown/")
export const fetchTypesDropdown = () => get("/types/dropdown/")
export async function fetchCoursesDropdown() {
  try {
    const res = await fetch(`${API_BASE_URL}/courses/?page_size=1000`)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const text = await res.text()
    if (!text) {
      return []
    }
    const data = JSON.parse(text)
    return Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching courses dropdown:", error)
    return []
  }
}
export const fetchFacilitiesDropdown = () => get("/facilities/dropdown/")
export const fetchDisciplinesDropdown = () => get("/disciplines/dropdown/")
export const fetchSchoolsDropdown = () => get("/schools/dropdown/")

// ========================
// 🎓 Admission APIs
// ========================

export const fetchAdmissions = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/admissions/`)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, value)
    }
  })
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch admissions")
  return res.json()
}

export const fetchAdmissionBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/admissions/${slug}/`)
  if (!res.ok) throw new Error("Failed to fetch admission")
  return res.json()
}

export const createAdmission = async (formData) => {
  const headers = getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/admissions/create/`, {
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

export const updateAdmission = async (slug, formData) => {
  const headers = getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/admissions/${slug}/update/`, {
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

export const deleteAdmission = async (slug) => {
  const headers = getTokenHeaders()
  const res = await fetch(`${API_BASE_URL}/admissions/${slug}/delete/`, {
    method: "DELETE",
    headers,
  })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    throw new Error("Delete failed")
  }
  return res.json()
}

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
  Object.entries(params).forEach(([key, value]) => {
    // Skip null/empty/undefined values
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, value)
    }
  })
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch schools")
  }
  return res.json()
}

export const fetchSchoolBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/schools/${slug}/`)
  return res.json()
}

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

export const fetchSchoolInquiries = async (filters = {}) => {
  const queryParams = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      queryParams.append(key, value)
    }
  })

  const url = `${API_BASE_URL}/schools/me/inquiries/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

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

export const updateInquiryContactStatus = async (inquiryId, contacted) => {
  const headers = getAuthHeaders()

  console.log(`Sending contact status update for inquiry ${inquiryId}: ${contacted}`)

  const res = await fetch(`${API_BASE_URL}/schools/me/inquiries/${inquiryId}/contact-status/`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ contacted }),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    console.error("Error response:", errorData)

    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    throw new Error(errorData?.error || "Failed to update contact status")
  }

  return res.json()
}

export const fetchSchoolInquiriesAnalytics = async () => {
  const headers = getAuthHeaders()
  const res = await fetch(`${API_BASE_URL}/schools/me/inquiries/analytics/`, {
    headers,
  })

  if (!res.ok) {
    if (res.status === 401) {
      logout()
      throw new Error("Unauthorized")
    }
    throw new Error("Failed to fetch analytics")
  }
  return res.json()
}

export const exportSchoolInquiriesExcel = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/schools/me/inquiries/export/`)
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
  link.download = `school_inquiries_export_${new Date().toISOString().split("T")[0]}.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(downloadUrl)
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
export const fetchAdsByPlacements = async (placements = []) => {
  // Usage: fetchAdsByPlacements(['home-1', 'home-2'])
  const url = new URL(`${API_BASE_URL}/ads/`)
  placements.forEach((placement) => url.searchParams.append("placement", placement))
  const res = await fetch(url)
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

// For Home
// Fetch all featured schools
export const fetchFeaturedSchools = async () => {
  // Only return schools where featured=true
  const url = new URL(`${API_BASE_URL}/schools/`)
  url.searchParams.append("featured", "true")
  const res = await fetch(url)
  return res.json()
}

// Fetch all featured admissions
export const fetchFeaturedAdmissions = async () => {
  const url = new URL(`${API_BASE_URL}/admissions/`)
  url.searchParams.append("featured", "true")
  const res = await fetch(url)
  return res.json()
}

// Fetch most recent news/information (limit 6 for example)
export const fetchRecentNews = async (limit = 6) => {
  const url = new URL(`${API_BASE_URL}/information/`)
  url.searchParams.append("ordering", "-published_date")
  url.searchParams.append("is_active", "true")
  url.searchParams.append("featured", "false")
  url.searchParams.append("limit", limit)
  const res = await fetch(url)
  return res.json()
}

// Inquiry
export const createInquiry = async (data) => {
  const res = await fetch(`${API_BASE_URL}/inquiries/inquiries/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to submit inquiry")
  return res.json()
}

export const createPreRegistrationInquiry = async (data) => {
  const res = await fetch(`${API_BASE_URL}/inquiries/pre-registration/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to submit pre-registration")
  return res.json()
}
