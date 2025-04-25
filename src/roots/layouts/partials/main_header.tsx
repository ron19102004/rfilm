import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

interface User {
  avatar: string
}

interface MainHeaderProps {
  user?: User | null
}

const MainHeader: React.FC<MainHeaderProps> = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-[#0a0a0a] shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-red-500">
            RFilm
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 focus:outline-none"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </button>
                <div
                  className={`absolute right-0 mt-2 w-48 bg-[#0a0a0a] rounded-lg shadow-lg z-50 ${
                    isDropdownOpen ? 'block' : 'hidden'
                  }`}
                >
                  <div className="py-1">
                    <Link
                      to="/auth/logout"
                      className="block px-4 py-2 text-gray-200 hover:bg-gray-700" 
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>Đăng xuất
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="bg-red-600 text-white px-4 py-2 rounded-lg transition-colors hover:bg-red-700"
              >
                <i className="fas fa-user mr-2"></i>Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default MainHeader
