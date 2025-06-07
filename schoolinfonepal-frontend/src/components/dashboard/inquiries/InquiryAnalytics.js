"use client"

import { useState, useEffect } from "react"
import { fetchSchoolInquiriesAnalytics } from "@/utils/api"

const AnalyticsCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>{icon}</div>
      <div className="ml-5 w-0 flex-1">
        <dl>
          <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
          <dd>
            <div className="text-lg font-medium text-gray-900">{value}</div>
          </dd>
        </dl>
      </div>
    </div>
  </div>
)

const InquiryAnalytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true)
        const data = await fetchSchoolInquiriesAnalytics()
        setAnalytics(data)
        setError(null)
      } catch (err) {
        console.error("Failed to load analytics:", err)
        setError("Failed to load analytics data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return null
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <AnalyticsCard
          title="Total Inquiries"
          value={analytics.total_inquiries}
          icon={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
          color="bg-blue-500"
        />
        <AnalyticsCard
          title="Pre-Registrations"
          value={analytics.total_pre_registrations}
          icon={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
          color="bg-green-500"
        />
        <AnalyticsCard
          title="Contacted"
          value={analytics.contacted_inquiries + analytics.contacted_pre_registrations}
          icon={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          color="bg-emerald-500"
        />
        <AnalyticsCard
          title="Not Contacted"
          value={analytics.not_contacted_inquiries + analytics.not_contacted_pre_registrations}
          icon={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          color="bg-amber-500"
        />
      </div>

      {/* Course Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Course Distribution</h3>
        <div className="space-y-4">
          {analytics.course_distribution.map((course) => (
            <div key={course.course__name || "unknown"} className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{course.course__name || "Unknown"}</span>
                <span className="text-sm font-medium text-gray-700">{course.count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${(course.count / Math.max(...analytics.course_distribution.map((c) => c.count))) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Trends Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Inquiry Trends (Last 30 Days)</h3>
        <div className="h-64 flex items-end space-x-1">
          {analytics.daily_trends.map((day) => {
            const maxCount = Math.max(...analytics.daily_trends.map((d) => d.total))
            const height = maxCount > 0 ? (day.total / maxCount) * 100 : 0
            const inquiryHeight = day.total > 0 ? (day.inquiries / day.total) * height : 0
            const preRegHeight = day.total > 0 ? (day.pre_registrations / day.total) * height : 0

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col justify-end h-48">
                  {day.inquiries > 0 && (
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${inquiryHeight}%` }}
                      title={`Regular Inquiries: ${day.inquiries}`}
                    ></div>
                  )}
                  {day.pre_registrations > 0 && (
                    <div
                      className="w-full bg-green-500"
                      style={{ height: `${preRegHeight}%` }}
                      title={`Pre-Registrations: ${day.pre_registrations}`}
                    ></div>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                  {new Date(day.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-center mt-8 space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Regular Inquiries</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Pre-Registrations</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InquiryAnalytics
