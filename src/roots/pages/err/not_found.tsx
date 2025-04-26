import React from 'react'

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl w-full">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-red-600 mb-2 md:mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-300 mb-4 md:mb-6">Page Not Found</h2>
        <p className="text-base md:text-lg text-gray-400 mb-6 md:mb-8 px-4">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <a 
          href="/"
          className="inline-block px-4 md:px-6 py-2 md:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 text-sm md:text-base"
        >
          Return Home
        </a>
      </div>
    </div>
  )
}

export default NotFoundPage;
