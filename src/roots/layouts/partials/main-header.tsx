import { useAuthContext, useSystemContext } from "@/context";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  User,
  LogOut,
  Search,
  TabletSmartphone,
  UserRound,
  ChevronDown,
  MonitorSmartphone,
  MonitorDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ListView from "@/components/list";
import { Country, Genre } from "@/apis/index.d";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { Capacitor } from "@capacitor/core";

export const MenuFilter: React.FC<{
  countries: Country[];
  genres: Genre[];
  className?: ClassValue;
}> = ({ countries, genres, className }) => {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none ring-0 focus:outline-none focus:ring-0 bg-[#2a2a2a] border-[#2a2a2a] lg:bg-transparent lg:border-0 rounded-md px-2 py-1 lg:p-0">
          <div className="flex items-center gap-2">
            <h1 className="text-white font-semibold lg:font-normal">
              Quốc gia
            </h1>
            <ChevronDown className="text-[#4a4a4a] lg:text-white h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#2a2a2a] text-white border-[#3a3a3a] outline-none ring-0 focus:outline-none focus:ring-0">
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
            <ListView
              data={countries}
              render={(coun, index) => (
                <DropdownMenuItem key={index}>
                  <Link to={`/quoc-gia/${coun.slug}`}>
                    <h1>{coun.name}</h1>
                  </Link>
                </DropdownMenuItem>
              )}
            />
          </ul>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none ring-0 focus:outline-none focus:ring-0 bg-[#2a2a2a] border-[#2a2a2a] lg:bg-transparent lg:border-0 rounded-md px-2 py-1 lg:p-0">
          <div className="flex items-center gap-2">
            <h1 className="text-white font-semibold lg:font-normal">
              Thể loại
            </h1>
            <ChevronDown className="text-[#4a4a4a] lg:text-white h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#2a2a2a] text-white border-[#3a3a3a] outline-none ring-0 focus:outline-none focus:ring-0">
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
            <ListView
              data={genres}
              render={(gen, index) => (
                <DropdownMenuItem key={index}>
                  <Link to={`/the-loai/${gen.slug}`}>
                    <h1>{gen.name}</h1>
                  </Link>
                </DropdownMenuItem>
              )}
            />
          </ul>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const MainHeader: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { signInWithGoogle, user, logout } = useAuthContext();
  const {
    scrollToTop,
    countries,
    genres,
    downloadAndInstallApk,
    exeDownloadAppWindow,
  } = useSystemContext();

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
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
          <div className="flex items-center gap-4">
            <Link
              onClick={scrollToTop}
              to="/"
              className="text-3xl font-bold bg-gradient-to-r from-red-500 via-orange-600 to-red-700 bg-clip-text text-transparent hover:from-red-600 hover:via-orange-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
            >
              <span>RFilm</span>
            </Link>
            <MenuFilter
              countries={countries}
              genres={genres}
              className="hidden lg:flex"
            />
          </div>
          <div className="flex items-center gap-6">
            <Link to="/tim-kiem">
              <Search className="text-white h-6 w-6" />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none ring-0 focus:outline-none focus:ring-0 bg-[#2a2a2a] border-[#2a2a2a] lg:bg-transparent lg:border-0 rounded-md px-2 py-1 lg:p-0">
                <button
                  className={cn("flex items-center gap-2 cursor-pointer", {
                    hidden: Capacitor.isNativePlatform(),
                  })}
                >
                  <MonitorSmartphone className="text-white h-6 w-6" />
                  <h1 className="text-white text-sm hidden md:block">
                    <p>Tải ứng dụng</p>
                    <p className="font-bold">RFilm</p>
                  </h1>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#2a2a2a] text-white  border-[#3a3a3a] outline-none ring-0 focus:outline-none focus:ring-0">
                <DropdownMenuItem className="hover:bg-transparent">
                  <button
                    onClick={async () => await downloadAndInstallApk()}
                    className={cn("flex items-center gap-2 cursor-pointer", {})}
                  >
                    <TabletSmartphone className="h-6 w-6" />
                    <h1 className="t text-sm ">
                      <p className="font-bold">Android</p>
                    </h1>
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-transparent">
                  <a
                    href={exeDownloadAppWindow}
                    className={cn("flex items-center gap-2 cursor-pointer", {})}
                  >
                    <MonitorDown className="h-6 w-6" />
                    <h1 className=" text-sm">
                      <p className="font-bold">Window</p>
                    </h1>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
                className={`text-white p-1 md:px-4 md:py-2 rounded-lg transition-colors hover:bg-red-700 flex items-center gap-2 cursor-pointer`}
                style={{
                  backgroundColor: `rgba(255, 0, 0, ${headerOpacity})`,
                }}
              >
                <UserRound className="inline-block w-6 h-6" />
                <span className="hidden md:block">Thành viên</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default MainHeader;
