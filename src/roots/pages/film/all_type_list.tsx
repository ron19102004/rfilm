import { FilmTypeList } from "@/apis/index.d";
import { transFilmTypeToVN } from "@/apis/trans.f";
import ListView from "@/components/list";
import MainBackMobile from "@/roots/layouts/partials/main_back_mobile";
import React from "react";
import { Link } from "react-router-dom";

const AllTypeListPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-8">
      <MainBackMobile title="Tất cả danh sách" />
      <div className="text-white overflow-hidden scrollbar-hide relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
          <ListView
            data={Object.values(FilmTypeList).filter(
              (item) => item !== FilmTypeList.ALL
            )}
            render={(type, index) => {
              const bgColors = [
                "bg-gradient-to-r from-red-900 to-red-800",
                "bg-gradient-to-r from-red-800 to-red-700",
                "bg-gradient-to-r from-red-700 to-red-600",
                "bg-gradient-to-r from-red-600 to-red-500",
                "bg-gradient-to-r from-red-500 to-red-400",
              ];
              return (
                <Link
                  key={type}
                  to={`/danh-sach/${type}`}
                  className={`${
                    bgColors[index % bgColors.length]
                  } px-6 rounded-lg 
                    hover:scale-105 transition-all duration-300 ease-in-out
                    shadow-lg hover:shadow-red-500/20
                    border border-red-900/30
                    whitespace-nowrap
                    text-white font-medium flex items-center justify-center py-10 md:px-20`}
                >
                  {transFilmTypeToVN(type)}
                </Link>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AllTypeListPage;
