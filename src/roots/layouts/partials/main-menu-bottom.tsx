import { useSystemContext } from "@/context";
import { HouseIcon, ListIcon, SearchIcon, UserIcon } from "lucide-react";
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
    icon: <HouseIcon />,
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
  const { scrollToTop } = useSystemContext();
  return (
    <div className="fixed bottom-2 right-0 md:bottom-4 w-[90vw] md:w-96 left-1/2 -translate-x-1/2 bg-[#1a1a1a]/70 backdrop-blur rounded-2xl  border border-[#3a3a3a] xl:hidden z-10">
      <div className="flex justify-around items-center h-16">
        {menuItems.map((item) => (
          <NavLink
            onClick={scrollToTop}
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
