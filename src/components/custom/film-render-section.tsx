import { ChevronLeft, ChevronRight } from "lucide-react";
import { Film } from "lucide-react";
import MovieCard from "./movie-card";
import React, { useEffect, useRef, useState } from "react";
import ListView from "../list";
import { Movie } from "@/apis/index.d";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
interface FilmSlideProps {
  movies: Movie[];
  title: string;
  titleClassName?: ClassValue;
  borderLeftColor?: string;
  href?: string;
}
const FilmRenderSection: React.FC<FilmSlideProps> = ({
  movies,
  title,
  titleClassName,
  borderLeftColor = "border-red-600",
  href,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
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
    <div>
      {movies && movies.length > 0 ? (
        <div className="">
          <h1
            className={cn(
              "text-2xl md:text-3xl font-bold text-white py-4 flex items-center gap-2 border-l-4 pl-4",
              borderLeftColor
            )}
          >
            <Film className="w-8 h-8" />
            {href ? (
              <Link to={href || ""} className={cn("flex items-center gap-2")}>
                <span
                  className={cn(
                    "title-hover text-transparent bg-clip-text ",
                    titleClassName
                      ? titleClassName
                      : " bg-gradient-to-r from-red-600 to-yellow-400 "
                  )}
                >
                  {title}
                </span>
                <ChevronRight
                  className={cn(
                    "w-6 h-6 bg-clip-text text-white",
                    titleClassName
                  )}
                />
              </Link>
            ) : (
              <span
                className={cn(
                  "title-hover text-transparent bg-clip-text ",
                  titleClassName
                    ? titleClassName
                    : " bg-gradient-to-r from-red-600 to-yellow-400 "
                )}
              >
                {title}
              </span>
            )}
          </h1>
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto py-4 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pl-2"
              onScroll={checkScroll}
            >
              <ListView
                data={movies}
                render={(mo, index) => (
                  <div key={index}>
                    <MovieCard movie={mo} key={index} imgSize="w-60" />
                  </div>
                )}
              />
            </div>
            {/* Navigation Buttons - Only visible on desktop */}
            <button
              onClick={scrollLeft}
              className={`absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-r-lg hidden cursor-pointer ${
                canScrollLeft ? "md:block" : "hidden"
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollRight}
              className={`absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-l-lg hidden cursor-pointer ${
                canScrollRight ? "md:block" : "hidden"
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FilmRenderSection;
