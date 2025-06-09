const LoadingState = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
          <div className="p-5 border-b border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="p-4 bg-gray-50 flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LoadingState
