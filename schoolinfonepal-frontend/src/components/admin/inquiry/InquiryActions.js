"use client"

const InquiryActions = ({ activeTab }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Inquiry Management</h2>
      <div className="flex space-x-3">
        <div className="text-sm text-gray-500">
          {activeTab === "all" && "Viewing all inquiries"}
          {activeTab === "inquiries" && "Viewing regular inquiries"}
          {activeTab === "pre_registrations" && "Viewing pre-registration inquiries"}
        </div>
      </div>
    </div>
  )
}

export default InquiryActions
