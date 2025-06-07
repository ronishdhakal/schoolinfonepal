"use client"

import { useState, useEffect } from "react"
import { fetchInquiryAnalytics } from "@/utils/api"

const AnalyticsCard = ({ title, value, icon, color }) => (
  <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
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

const TopItemsList = ({ title, items }) => (
  <div className="bg-white overflow-hidden shadow-sm rounded-lg">
    <div className="px-4 py-5 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
    </div>
    <div className="border-t border-gray-200">
      <ul className="divide-y divide-gray-200">
        {items.map((item, index) => (
          <li key={index} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.school__name || item.course__name || "N/A"}
              </p>
              <p className="ml-2 flex-shrink-0 text-sm text-gray-500">{item.count} inquiries</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
)

const InquiryAnalytics = ({ filters }) => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true)
        const data = await fetchInquiryAnalytics(filters)
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
  }, [filters])

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
          title="Total Inquiries"
          value={analytics.total_inquiries + analytics.total_pre_registrations}
          icon={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
          color="bg-purple-500"
        />
        <AnalyticsCard
          title="Conversion Rate"
          value={`${
            analytics.total_pre_registrations > 0
              ? Math.round(
                  (analytics.total_pre_registrations /
                    (analytics.total_inquiries + analytics.total_pre_registrations)) *
                    100,
                )
              : 0
          }%`}
          icon={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
          color="bg-yellow-500"
        />
      </div>

      {/* Top Schools and Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopItemsList title="Top Schools by Inquiries" items={analytics.top_schools_inquiries} />
        <TopItemsList title="Top Courses by Inquiries" items={analytics.top_courses_inquiries} />
      </div>

      {/* Daily Trends Chart */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Daily Inquiry Trends (Last 7 Days)</h3>
        <div className="h-64 flex items-end space-x-2">
          {Object.entries(analytics.daily_trends.inquiries).map(([date, count], index) => {
            const preRegCount = analytics.daily_trends.pre_registrations[date] || 0
            const maxCount = Math.max(
              ...Object.values(analytics.daily_trends.inquiries),
              ...Object.values(analytics.daily_trends.pre_registrations),
            )
            const inquiryHeight = maxCount > 0 ? (count / maxCount) * 100 : 0
            const preRegHeight = maxCount > 0 ? (preRegCount / maxCount) * 100 : 0

            return (
              <div key={date} className="flex-1 flex flex-col items-center">
                <div className="w-full flex justify-center space-x-1">
                  <div
                    className="w-5 bg-blue-500 rounded-t"
                    style={{ height: `${inquiryHeight}%` }}
                    title={`Regular Inquiries: ${count}`}
                  ></div>
                  <div
                    className="w-5 bg-green-500 rounded-t"
                    style={{ height: `${preRegHeight}%` }}
                    title={`Pre-Registrations: ${preRegCount}`}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-center mt-4 space-x-6">
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
