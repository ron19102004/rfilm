import { HomeIcon, ListIcon, SearchIcon, UserIcon } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    label: "Trang chủ",
    icon: <HomeIcon />,
    href: "/",
  },
  {
    label: "Tìm kiếm",
    icon: <SearchIcon />,
    href: "/tim-kiem",
  },
  {
    label: "Danh sách",
    icon: <ListIcon />,
    href: "/tat-ca-danh-sach",
  },
  {
    label: "Tài khoản",
    icon: <UserIcon />,
    href: "/profile",
  },
];

const MainMenuBottomMobile: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-gray-800 md:hidden">
      <div className="flex justify-around items-center h-16">
        {menuItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full ${
                isActive ? "text-red-500" : "text-gray-400 hover:text-red-500"
              } transition-colors duration-200`
            }
          >
            <div className="text-xl">{item.icon}</div>
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default MainMenuBottomMobile;
