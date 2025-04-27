import React, { useState, useEffect, useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSystemContext } from "@/context";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Genre } from "@/apis";
import Slider from "react-slick";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { URL_IMG } from "@/constant/api.constant";

const FilmIntroSlider: React.FC = () => {
  const { filmIntro } = useSystemContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Split movies into two halves
  const firstHalfMovies =
    filmIntro?.slice(0, Math.ceil(filmIntro.length / 2)) || [];
  const secondHalfMovies =
    filmIntro?.slice(Math.ceil(filmIntro.length / 2)) || [];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Calculate visible thumbnails
  const getVisibleThumbnails = () => {
    if (!firstHalfMovies || firstHalfMovies.length === 0) return [];

    const totalItems = firstHalfMovies.length;
    const itemsToShow = 5;
    let startIndex = activeIndex;

    // If we're near the end, show items from the beginning
    if (activeIndex + itemsToShow > totalItems) {
      startIndex = Math.max(0, totalItems - itemsToShow);
    }

    return Array.from(
      { length: itemsToShow },
      (_, i) => (startIndex + i) % totalItems
    );
  };

  // Auto slide effect
  useEffect(() => {
    if (!firstHalfMovies || firstHalfMovies.length === 0) return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set new interval
    intervalRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % firstHalfMovies.length);
    }, 5000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [firstHalfMovies]);

  // Auto scroll to active thumbnail
  useEffect(() => {
    if (!thumbnailContainerRef.current) return;

    const container = thumbnailContainerRef.current;
    const thumbnails = container.getElementsByClassName("thumbnail-item");
    const activeThumbnail = thumbnails[activeIndex % 5] as HTMLElement;

    if (activeThumbnail) {
      const containerRect = container.getBoundingClientRect();
      const thumbnailRect = activeThumbnail.getBoundingClientRect();

      const scrollLeft =
        activeThumbnail.offsetLeft -
        containerRect.width / 2 +
        thumbnailRect.width / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  const SkeletonCard = () => (
    <div className="p-2">
      <div className="bg-[#1a1a1a] border border-[#424242] shadow-lg rounded-lg overflow-hidden">
        <div className="relative">
          <div className="w-full h-64 bg-[#0a0a0a] animate-pulse" />
          <div className="absolute top-2 right-2">
            <div className="w-16 h-6 bg-[#2a2a2a]rounded animate-pulse" />
          </div>
        </div>
        <div className="p-4">
          <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse mb-2" />
          <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse" />
        </div>
      </div>
    </div>
  );

  const SkeletonHero = () => (
    <div className="space-y-4">
      <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-screen bg-black overflow-hidden">
        {/* Skeleton background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90">
          <div className="w-full h-full bg-[#1a1a1a] animate-pulse" />
        </div>

        {/* Skeleton content */}
        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-24">
          <div className="max-w-4xl">
            {/* Title skeleton */}
            <div className="h-8 sm:h-10 md:h-12 lg:h-16 bg-[#2a2a2a] rounded-lg w-3/4 animate-pulse mb-3 sm:mb-4" />
            <div className="h-6 sm:h-8 md:h-10 bg-[#2a2a2a] rounded-lg w-1/2 animate-pulse mb-4 sm:mb-6" />

            {/* Info skeleton */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
              <div className="h-5 sm:h-6 bg-[#2a2a2a] rounded-full w-16 sm:w-20 animate-pulse" />
              <div className="h-5 sm:h-6 bg-[#2a2a2a] rounded-full w-12 sm:w-16 animate-pulse" />
              <div className="h-5 sm:h-6 bg-[#2a2a2a] rounded-full w-20 sm:w-24 animate-pulse" />
            </div>

            {/* Categories skeleton */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
              {[...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-6 sm:h-8 bg-[#2a2a2a] rounded-full w-20 sm:w-24 animate-pulse"
                />
              ))}
            </div>

            {/* Description skeleton */}
            <div className="space-y-2 mb-6 sm:mb-8">
              <div className="h-3 sm:h-4 bg-[#2a2a2a] rounded w-full animate-pulse" />
              <div className="h-3 sm:h-4 bg-[#2a2a2a] rounded w-5/6 animate-pulse" />
              <div className="h-3 sm:h-4 bg-[#2a2a2a] rounded w-4/6 animate-pulse" />
            </div>

            {/* Play button skeleton */}
            <div className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 bg-[#2a2a2a] rounded-full animate-pulse" />
          </div>
        </div>

        {/* Thumbnail skeleton */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 md:gap-4">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="w-16 h-12 sm:w-24 sm:h-16 md:w-32 md:h-20 bg-[#2a2a2a] rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
      <div className="w-full mx-auto px-10 py-2">
        <Slider {...settings}>
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </Slider>
      </div>
    </div>
  );

  if (!filmIntro || filmIntro.length === 0) {
    return <SkeletonHero />;
  }

  const activeMovie = firstHalfMovies[activeIndex];

  return (
    <div className="mx-auto px-4">
      <div className="w-full mx-auto">
        <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-screen bg-[#0a0a0a] overflow-hidden rounded-2xl">
          {/* Background image with parallax effect */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 image-filter-wrapper"
          >
            <img
              src={activeMovie.thumb_url}
              alt={activeMovie.name}
              className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-full object-cover rounded-2xl"
            />
          </motion.div>

          {/* Enhanced overlay with gradient 
          backdrop-blur: mờ hơn
          */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent opacity-50 md:opacity-70"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-black/20 to-transparent opacity-70 "></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black/20 to-transparent opacity-50 md:opacity-70"></div>

          {/* Content with enhanced animations */}
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-24 text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl"
              >
                <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                  <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 line-clamp-2">
                    {activeMovie.name}
                  </h1>
                  <h2 className="text-base sm:text-lg md:text-2xl lg:text-3xl text-red-400 font-light line-clamp-1">
                    {activeMovie.origin_name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
                    <span className="bg-red-500/20 text-red-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                      {activeMovie.quality}
                    </span>
                    <span className="bg-white/10 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                      {activeMovie.lang}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {activeMovie.category?.map((genre: Genre) => (
                      <span
                        key={genre._id}
                        className="border border-white/30 px-2 sm:px-4 py-1 rounded-full text-xs sm:text-sm hover:bg-white/10 transition-colors"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {activeMovie.name} - {activeMovie.origin_name}
                  </p>

                  {/* Enhanced play button */}
                  <Link
                    to={`/xem-phim/${activeMovie.slug}`}
                    className="cursor-pointer"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-5.197-3.028A1 1 0 008 9.038v5.924a1 1 0 001.555.832l5.197-3.028a1 1 0 000-1.698z"
                        />
                      </svg>
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Enhanced thumbnail slider */}
          <div className="hidden md:block absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="relative">
                {/* Gradient overlays for scroll indication */}
                <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-black/50 to-transparent z-10 pointer-events-none rounded-l-2xl" />
                <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-black/0 to-transparent z-10 pointer-events-none" />

                {/* Thumbnail container */}
                <div
                  ref={thumbnailContainerRef}
                  className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-none pb-4 md:pb-0"
                >
                  <div className="flex gap-2 sm:gap-3 md:gap-4 scrollbar-hide overflow-hidden py-2 px-2">
                    {getVisibleThumbnails().map((idx) => {
                      const movie = firstHalfMovies[idx];
                      return (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`thumbnail-item relative flex-shrink-0 w-16 h-12 sm:w-24 sm:h-16 md:w-32 md:h-20 rounded-lg cursor-pointer transition-all duration-300 ${
                            idx === activeIndex
                              ? "ring-2 ring-red-500 shadow-lg shadow-red-500/30"
                              : "opacity-50 hover:opacity-100"
                          }`}
                          onClick={() => setActiveIndex(idx)}
                        >
                          {/* Thumbnail image */}
                          <img
                            src={movie.poster_url}
                            alt={movie.name}
                            className="object-cover w-full h-full rounded-lg"
                          />

                          {/* Active indicator */}
                          {idx === activeIndex && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"
                            />
                          )}

                          {/* Movie title on hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/60 rounded-lg">
                            <p className="text-white text-[10px] sm:text-xs md:text-sm font-medium text-center px-1 sm:px-2 line-clamp-2">
                              {movie.name}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-4 py-2 ">
        <Slider {...settings}>
          {secondHalfMovies.map((movie, index) => (
            <HoverCard>
              <HoverCardTrigger>
                <div key={index} className="px-2 py-4">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <div className="bg-[#1a1a1a] border border-[#424242] shadow-lg rounded-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 ">
                      <div className="relative transition-all">
                        <img
                          src={movie.thumb_url}
                          alt={movie.name}
                          className="w-full h-64 object-cover group-hover:opacity-90 md:opacity-50 transition-all"
                        />
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                          {movie.year}
                        </div>
                      </div>
                      <div className="p-4">
                        <Link to={`/xem-phim/${movie.slug}`} className="block">
                          <h3 className="text-lg font-semibold text-white hover:text-red-500 transition-colors line-clamp-1">
                            {movie.name}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1 line-clamp-1 font-bold">
                            {movie.origin_name}
                          </p>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent>
                <HoverCardContent
                  className="bg-[#1a1a1a] border-[#252525] w-96 hidden md:block space-y-4 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl"
                  sideOffset={5}
                >
                  <div className="w-full pb-2 relative transition-all duration-300">
                    <Link to={`/xem-phim/${movie.slug}`}>
                      <img
                        src={
                          movie.thumb_url.startsWith("https") ||
                          movie.thumb_url.startsWith("https")
                            ? movie.thumb_url
                            : `${URL_IMG}${movie.thumb_url}`
                        }
                        alt={movie.name}
                        className="w-full h-80 object-cover group-hover:opacity-90 rounded-2xl hover:scale-105 transition-all duration-300"
                      />
                    </Link>
                    <div className="absolute top-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-sm">
                      {movie.quality}
                    </div>
                    <div className="absolute top-2 left-2 bg-black/75 text-white px-2 py-1 rounded text-sm">
                      {movie.episode_current}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 truncate">
                      <Link to={`/xem-phim/${movie.slug}`}>{movie.name}</Link>
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {movie.origin_name}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="bg-[#2a2a2a] px-2 py-1 rounded">
                        {movie.year}
                      </span>
                      <span>•</span>
                      <span className="bg-[#2a2a2a] px-2 py-1 rounded">
                        {movie.time}
                      </span>
                      <span>•</span>
                      <span className="bg-[#2a2a2a] px-2 py-1 rounded">
                        {movie.lang}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {movie?.category?.map((cat) => (
                        <span
                          key={cat.name}
                          className="px-3 py-1 bg-[#2a2a2a] text-gray-200 rounded-full text-xs hover:bg-[#3a3a3a] transition-colors"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {movie?.country?.map((country) => (
                        <span
                          key={country.name}
                          className="px-3 py-1 bg-[#2a2a2a] text-gray-200 rounded-full text-xs hover:bg-[#3a3a3a] transition-colors"
                        >
                          {country.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-300 flex items-center justify-center gap-2 py-2 rounded-lg shadow-md hover:shadow-lg">
                      <Link
                        to={`/xem-phim/${movie.slug}`}
                        className="flex items-center justify-center w-full"
                      >
                        <Play className="w-5 h-5" />
                        <span>Xem ngay</span>
                      </Link>
                    </Button>
                  </div>
                </HoverCardContent>{" "}
              </HoverCardContent>
            </HoverCard>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default FilmIntroSlider;
