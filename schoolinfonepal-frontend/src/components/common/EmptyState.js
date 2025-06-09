import { Search } from "lucide-react"

const EmptyState = ({
  message = "No courses found",
  description = "Try adjusting your filters or search criteria.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <Search size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{message}</h3>
      <p className="text-gray-500 max-w-md">{description}</p>
    </div>
  )
}

export default EmptyState
