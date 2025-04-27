import React, { useEffect, useRef, useState } from "react";
import { useAuthContext, useMyMovieContext, useSystemContext } from "@/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import PullToRefresh from "@/components/custom/pull_to_refresh";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { URL_IMG } from "@/constant/api.constant";
import { Link } from "react-router-dom";
import ListView from "@/components/list";
import { Timestamp } from "firebase/firestore";
import MainBackMobile from "@/roots/layouts/partials/main_back_mobile";

const ProfilePage: React.FC = () => {
  const { scrollToTop } = useSystemContext();
  const { user } = useAuthContext();
  const { movies, loadMyMovies } = useMyMovieContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    loadMyMovies();
  }, [user]);


  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    scrollToTop()
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 300;
      checkScroll();
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 300;
      checkScroll();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <PullToRefresh onRefresh={loadMyMovies} />
      <div className="max-w-6xl mx-auto">
        <MainBackMobile title="Thông tin tài khoản" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {/* Profile Header Card */}
          <Card className="relative overflow-hidden bg-[#1a1a1a] border-[#2a2a2a] ">
            <div className="absolute inset-0 bg-[#1a1a1a]"></div>
            <CardContent className="relative pt-8">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#1a1a1a] blur-xl rounded-full"></div>
                  <Avatar className="relative h-32 w-32 border-2 border-[#2a2a2a] ">
                    <AvatarImage
                      src={user?.picture || ""}
                      alt={user?.name || "User"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-red-500/10 text-red-500 text-3xl">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {user?.name || "User Name"}
                  </h2>
                  <p className="text-red-400 font-medium">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details Card */}
          <Card className="md:col-span-2 relative overflow-hidden bg-[#1a1a1a] border-[#2a2a2a] ">
            <div className="absolute inset-0bg-[#1a1a1a]"></div>
            <CardHeader className="relative">
              <CardTitle className="text-white text-xl font-semibold tracking-tight">
                Profile Information
              </CardTitle>
              <Separator className="my-4 border-[#2a2a2a]" />
            </CardHeader>
            <CardContent className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm font-medium">Sub</p>
                  <p className="text-white/90 font-mono text-sm">
                    {user?.sub || "Not available"}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm font-medium">Full Name</p>
                  <p className="text-white/90 font-mono text-sm">
                    {user?.name || "Not available"}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm font-medium">Email</p>
                  <p className="text-white/90 font-mono text-sm">
                    {user?.email || "Not available"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Watched Movies Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Phim đã xem gần đây
          </h2>
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto py-4 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              onScroll={checkScroll}
            >
              <ListView
                data={movies}
                render={(movieWatched) => (
                  <Card
                    key={movieWatched.movie.movie._id}
                    className="md:min-w-[300px] md:max-w-[300px] min-w-[250px] max-w-[250px] bg-[#1a1a1a] border-[#2a2a2a] overflow-hidden transition-all duration-300 hover:-translate-y-1 py-0"
                  >
                    <Link to={`/xem-phim/${movieWatched.movie.movie.slug}`}>
                      <div className="relative group">
                        <img
                          src={
                            movieWatched.movie.movie.poster_url.startsWith(
                              "https"
                            )
                              ? movieWatched.movie.movie.poster_url
                              : `${URL_IMG}${movieWatched.movie.movie.poster_url}`
                          }
                          alt={movieWatched.movie.movie.name}
                          className="w-full h-[300px] object-cover group-hover:opacity-90 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold text-white mb-1 truncate">
                          {movieWatched.movie.movie.name}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2 truncate">
                          {movieWatched.movie.movie.origin_name}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>{movieWatched.movie.movie.year}</span>
                          <span>•</span>
                          <span>{movieWatched.movie.movie.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Đã xem:{" "}
                          {new Date(
                            (movieWatched.watchedAt as unknown as Timestamp)
                              .seconds * 1000
                          ).toLocaleString("vi-VN")}
                        </p>
                      </CardContent>
                    </Link>
                  </Card>
                )}
              />
            </div>
            {/* Navigation Buttons - Only visible on desktop */}
            <button
              onClick={scrollLeft}
              className={`absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-r-lg hidden ${
                canScrollLeft ? "md:block" : "hidden"
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollRight}
              className={`absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-l-lg hidden ${
                canScrollRight ? "md:block" : "hidden"
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
