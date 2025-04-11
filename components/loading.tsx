export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-700">Loading...</p>
      </div>
    </div>
  )
}
