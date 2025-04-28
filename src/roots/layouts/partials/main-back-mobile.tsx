import React from "react";
import { useNavigate } from "react-router-dom";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";
interface MainBackMobileProps {
  title: string;
  className?: ClassValue;
  titleClassName?: ClassValue;
}
const MainBackMobile: React.FC<MainBackMobileProps> = ({ title, className, titleClassName }) => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className={cn("bg-white/300 backdrop-blur-sm py-2 flex justify-start gap-2 items-center px-2 transition-all", className)}>
      <button
        onClick={handleBack}
        className="flex items-center justify-center w-10 h-10 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h1 className={cn("text-2xl font-bold text-white py-2", titleClassName)}>{title}</h1>
    </div>
  );
};

export default MainBackMobile;
