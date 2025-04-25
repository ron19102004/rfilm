import React from "react";
import "./loading.css";

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      <div className="relative w-40 h-60 md:w-48 md:h-96">
        {/* Flag pole */}
        <div className="flag absolute left-0 w-2 h-full bg-gray-800 rounded-full"></div>

        {/* Flag */}
        <div className="flag absolute left-1 w-36 md:w-72 h-32 md:h-60 overflow-hidden">
          {/* Red top half */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-red-600"></div>

          {/* Blue bottom half */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-blue-600"></div>

          {/* Yellow star */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 L12 2"
                fill="#FFD700"
                stroke="#FFD700"
                strokeWidth="0.5"
              />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Welcome Text */}
      <div className="mt-8 px-4 max-w-2xl">
        <h2 className="welcome-text text-xl md:text-3xl mb-2">
          Cùng RFilm Chào Mừng
        </h2>
        <h1 className="welcome-text text-2xl md:text-4xl">
          50 Năm Thống Nhất Đất Nước
        </h1>
        <p className="welcome-text text-xl md:text-3xl mt-2">
          30/04/1975 - 30/04/2025
        </p>
      </div>
    </div>
  );
};

export default Loading;
