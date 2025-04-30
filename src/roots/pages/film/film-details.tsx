import filmApi from "@/apis/filmKK.api";
import {
  GetFilmsType,
  Movie,
  MovieDetails,
  MovieDetailsResponse,
} from "@/apis/index.d";
import FilmDetailsCard from "@/components/custom/film-details-card";
import HelmetSEO from "@/components/custom/helmet-seo";
import { ENDPOINT_WEB } from "@/constant/system.constant";
import { useSystemContext } from "@/context";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";
import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const FilmRenderSection = lazy(
  () => import("@/components/custom/film-render-section")
);

const FilmDetailsPage: React.FC = () => {
  const { scrollToTop, filmIntro } = useSystemContext();
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [movieDetails, setMovieDetails] = useState<MovieDetailsResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [moviesSuggest, setMoviesSuggest] = useState<Movie[]>([]);

  // Convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`
      : null;
  };

  const fetchMovie = useCallback(async () => {
    if (!slug) return;
    try {
      setIsLoading(true);
      const response = await filmApi.getFilmDetails(slug?.toString());
      if (response.status) {
        setMovieDetails(response);
        setMovie(response.movie);
        setIsLoading(false);
      } else {
        setError("Failed to load movie data");
        setIsLoading(false);
      }
    } catch (err) {
      setError("An error occurred while fetching the movie");
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    scrollToTop();
    fetchMovie();
  }, [slug]);

  const loadFilmsSuggest = useCallback(async () => {
    if (movie) {
      if (movie.country && movie.country.length > 0) {
        const country = movie.country[0];
        const moviesSuggest = await filmApi.getFilmsBy({
          type: GetFilmsType.COUNTRY,
          value: country.slug,
          page: 1,
          selectedCountry: "all",
          selectedGenre: "all",
          selectedYear: movie.year,
        });
        setMoviesSuggest(moviesSuggest.data.items);
      }
    }
  }, [movie]);
  useEffect(() => {
    scrollToTop();
    loadFilmsSuggest();
  }, [movie]);

  if (isLoading) {
    return (
      <div className="bg-[#1a1a1a] py-10 flex items-center justify-center">
        <div className="relative">
          <Loader className="w-16 h-16 text-red-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1a1a1a] py-10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-[#1a1a1a] rounded-2xl shadow-xl"
        >
          <h1 className="text-2xl font-bold mb-4 text-white">Error</h1>
          <p className="text-gray-400">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <HelmetSEO
      seo={{
        title: `${movie?.name} - RFilm`,
        keywords: `${movie?.name} - RFilm`,
        author: "Ronial",
        ogTitle: `${movie?.name} - RFilm`,
        ogDescription: `${movie?.content} - RFilm`,
        ogImage: `${movie?.thumb_url}`,
        ogType: "website",
        ogUrl: `${ENDPOINT_WEB}/chi-tiet-phim/${slug}`,
        ogSiteName: "RFilm",
        ogLocale: "vi_VN",
        canonicalUrl: `${ENDPOINT_WEB}/chi-tiet-phim/${slug}`,
      }}
    >
      <div className="bg-[#1a1a1a] min-h-screen relative">
        <div className="w-full relative">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-[50vh] md:h-[60vh] lg:h-screen relative overflow-hidden"
          >
            {/* Background Image */}
            <div className="w-full h-full image-filter-wrapper">
              <img
                src={movie?.thumb_url}
                alt={movie?.name}
                className="w-full h-full object-cover transform transition-transform duration-700"
              />
            </div>

            {/* Enhanced Gradient Overlays */}
            <div className="absolute inset-0"></div>

            {/* Movie Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-4xl mx-auto space-y-4 sm:space-y-6"
              >
                <div className="space-y-2 sm:space-y-3">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white drop-shadow-lg line-clamp-2">
                    {movie?.name}
                  </h1>
                  <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-red-400 font-bold line-clamp-1">
                    {movie?.origin_name}
                  </h2>
                  <p className="text-white line-clamp-2">{movie?.content}</p>
                </div>

                {/* Watch Now Button and Info */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to={`/xem-phim/${slug}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-lg flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-8 h-8 sm:w-12 sm:h-12 fill-amber-50"
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
                        Xem ngay
                      </motion.button>
                    </Link>

                    {movie?.trailer_url && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsTrailerOpen(true)}
                        className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 sm:w-8 sm:h-8 fill-amber-50"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Xem trailer
                      </motion.button>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="bg-white/10 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border border-white/20">
                      {movie?.quality}
                    </span>
                    <span className="bg-white/10 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border border-white/20">
                      {movie?.lang}
                    </span>
                    {movie?.category?.map((genre, index) => (
                      <Link to={"/the-loai/" + genre.slug}>
                        <span
                          key={index}
                          className="bg-white/10 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border border-white/20"
                        >
                          {genre.name}
                        </span>
                      </Link>
                    ))}
                    {movie?.country?.map((country, index) => (
                      <Link to={`/quoc-gia/${country.slug}`} key={index}>
                        <span className="bg-white/10 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border border-white/20">
                          {country.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]  to-transparent opacity-100"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]  to-transparent opacity-60 md:hidden"></div>
        </div>

        {/* Trailer Modal */}
        <AnimatePresence>
          {isTrailerOpen && movie?.trailer_url && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 bg-black/90 backdrop-blur-sm"
              onClick={() => setIsTrailerOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsTrailerOpen(false)}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 sm:w-6 sm:h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* YouTube Player */}
                <div className="relative w-full h-full">
                  <iframe
                    src={getYouTubeEmbedUrl(movie.trailer_url) || ""}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video player"
                    frameBorder="0"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Section */}
        <div className="relative z-10">
          <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12">
            <AnimatePresence mode="wait">
              {movieDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4 sm:pt-6 md:pt-8 lg:pt-12"
                >
                  <FilmDetailsCard movieDetails={movieDetails} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <Suspense
          fallback={
            <div className="w-full flex items-center justify-center">
              <Loader className="w-8 h-8 text-red-500 animate-spin" />
            </div>
          }
        >
          <div className="pt-4 sm:pt-6 md:pt-8 lg:pt-12">
            <FilmRenderSection movies={moviesSuggest} title="Gợi ý" />
          </div>
        </Suspense>
        <Suspense
          fallback={
            <div className="w-full flex items-center justify-center">
              <Loader className="w-8 h-8 text-red-500 animate-spin" />
            </div>
          }
        >
          <div className="pt-4 sm:pt-6 md:pt-8 lg:pt-12">
            <FilmRenderSection movies={filmIntro} title="Phim mới cập nhật" />
          </div>
        </Suspense>
      </div>
    </HelmetSEO>
  );
};

export default FilmDetailsPage;
