import { useAuthContext } from "@/context";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { User, LogOut, Search } from "lucide-react";

interface MainHeaderProps {}

const MainHeader: React.FC<MainHeaderProps> = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { signInWithGoogle, user, logout } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const headerOpacity = Math.min(scrollPosition / 200, 0.6);

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 "
      style={{ backgroundColor: `rgba(10, 10, 10, ${headerOpacity})` }}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <a
            href="/"
            className="text-3xl font-bold bg-gradient-to-r from-red-500 via-orange-600 to-red-700 bg-clip-text text-transparent hover:from-red-600 hover:via-orange-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
          >
            RFilm
          </a>
          <div className="flex items-center gap-4">
            <Link to="/tim-kiem">
              <Search className="text-white h-5 w-5" />
            </Link>
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 focus:outline-none"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <img
                    src={user.picture || user.name || ""}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </button>
                <div
                  className={`absolute right-0 mt-2 w-48 bg-[#0a0a0a]/70 rounded-lg shadow-lg z-50 backdrop-blur-sm ${
                    isDropdownOpen ? "block" : "hidden"
                  }`}
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
                  >
                    <User className="inline-block mr-2 w-4 h-4" />
                    Tài khoản
                  </Link>
                  <div className="py-1">
                    <Link
                      to={"/"}
                      onClick={logout}
                      className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
                    >
                      <LogOut className="inline-block mr-2 w-4 h-4" />
                      Đăng xuất
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="bg-red-600 text-white px-4 py-2 rounded-lg transition-colors hover:bg-red-700"
              >
                <i className="fas fa-user mr-2"></i>Đăng nhập
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default MainHeader;
