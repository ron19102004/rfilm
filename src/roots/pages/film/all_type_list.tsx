import { FilmTypeList } from "@/apis/index.d";
import { transFilmTypeToVN } from "@/apis/trans.f";
import ListView from "@/components/list";
import { useSystemContext } from "@/context";
import MainBackMobile from "@/roots/layouts/partials/main_back_mobile";
import { ChevronRight } from "lucide-react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const AllTypeListPage: React.FC = () => {
  const { scrollToTop } = useSystemContext();
  useEffect(() => {
    scrollToTop();
  }, []);
  return (
    <div className="px-4 md:px-8">
      <MainBackMobile title="Tất cả danh sách" />
      <div className="text-white overflow-hidden scrollbar-hide relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
          <ListView
            data={Object.values(FilmTypeList).filter(
              (item) => item !== FilmTypeList.ALL
            )}
            render={(type, index) => {
              const bgColors = [
                "bg-gradient-to-r from-red-600 to-orange-600",
                "bg-gradient-to-r from-orange-600 to-amber-600",
                "bg-gradient-to-r from-amber-600 to-yellow-600",
                "bg-gradient-to-r from-yellow-600 to-orange-500",
                "bg-gradient-to-r from-orange-500 to-red-500",
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
                    text-white font-medium flex items-center justify-center py-10 md:px-20 flex-col`}
                >
                  <h3 className="text-xl font-bold">
                    {transFilmTypeToVN(type)}
                  </h3>
                  <h4 className="flex items-center gap-2">
                    Xem thể loại
                    <ChevronRight className="w-4 h-4" />
                  </h4>
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
