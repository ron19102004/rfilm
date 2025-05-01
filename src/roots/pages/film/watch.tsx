import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "@/components/custom/loading";
import PullToRefresh from "@/components/custom/pull-to-refresh";
import {
  GetFilmsType,
  Movie,
  MovieDetails,
  MovieDetailsResponse,
  Server,
} from "@/apis/index.d";
import filmApi from "@/apis/filmKK.api";
import MainBackMobile from "@/roots/layouts/partials/main-back-mobile";
import { useFilmContext, useMyMovieContext, useSystemContext } from "@/context";
import { Share2, Facebook, Twitter, Send, Copy, Loader } from "lucide-react";
import ListView from "@/components/list";
import { Capacitor } from "@capacitor/core";
import { Clipboard } from "@capacitor/clipboard";
import { Share } from "@capacitor/share";
import toast from "react-hot-toast";
import FilmDetailsCard from "@/components/custom/film-details-card";
import { motion, AnimatePresence } from "framer-motion";
import { ENDPOINT_WEB } from "@/constant/system.constant";
import HelmetSEO from "@/components/custom/helmet-seo";
import { lazy, Suspense } from "react";

const FilmRenderSection = lazy(
  () => import("@/components/custom/film-render-section")
);

interface ShareProps {
  title: string;
  url: string;
  icon: React.ReactNode;
}
const shareProps: ShareProps[] = [
  {
    title: "Facebook",
    url: `https://www.facebook.com/sharer/sharer.php?u=`,
    icon: <Facebook className="w-5 h-5 text-red-500" />,
  },
  {
    title: "Twitter",
    url: `https://twitter.com/intent/tweet?url=`,
    icon: <Twitter className="w-5 h-5 text-red-500" />,
  },
  {
    title: "Telegram",
    url: `https://t.me/share/url?url=`,
    icon: <Send className="w-5 h-5 text-red-500" />,
  },
];

const WatchFilmPage: React.FC = () => {
  const { scrollToTop } = useSystemContext();
  const { filmIntro } = useFilmContext();
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [episodes, setEpisodes] = useState<Server[]>([]);
  const [movieDetails, setMovieDetails] = useState<MovieDetailsResponse | null>(
    null
  );
  const [activeServer, setActiveServer] = useState(0);
  const [activeEpisode, setActiveEpisode] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);
  const { saveOrUpdateMovie } = useMyMovieContext();
  const [moviesSuggest, setMoviesSuggest] = useState<Movie[]>([]);
  const videoPlayerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareRef.current &&
        !shareRef.current.contains(event.target as Node)
      ) {
        setIsShareOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchMovie = async () => {
    if (!slug) return;
    try {
      const response = await filmApi.getFilmDetails(slug?.toString());

      if (response.status) {
        setMovieDetails(response);
        setMovie(response.movie);
        setEpisodes(response.episodes);
        setIsLoading(false);
        await saveOrUpdateMovie(response);
      } else {
        setError("Failed to load movie data");
        setIsLoading(false);
      }
    } catch (err) {
      setError("An error occurred while fetching the movie");
      setIsLoading(false);
    }
  };
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

  const handleServerChange = (index: number) => {
    setActiveServer(index);
    setActiveEpisode(0);
  };

  const handleEpisodeChange = (index: number, embedUrl: string) => {
    setActiveEpisode(index);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.src = embedUrl;
    }
  };
  const handleShare = async () => {
    await Share.share({
      title: "Chia sẻ link",
      text: "Xem link này nè!",
      url: Capacitor.isNativePlatform()
        ? ENDPOINT_WEB + "/xem-phim/" + slug
        : window.location.href,
      dialogTitle: "Chia sẻ qua",
    });
  };
  const copyLinkHandle = async () => {
    if (Capacitor.isNativePlatform()) {
      await Clipboard.write({
        string: Capacitor.isNativePlatform()
          ? ENDPOINT_WEB + "/xem-phim/" + slug
          : window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
    toast.success("Đã sao chép link!");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="bg-[#1a1a1a] flex items-center justify-center mt-10">
        <Loader className="w-16 h-16 text-red-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1a1a1a] py-10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Error</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }
  if (!movie) return null;
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
        ogUrl: `${ENDPOINT_WEB}/xem-phim/${slug}`,
        ogSiteName: "RFilm",
        ogLocale: "vi_VN",
        canonicalUrl: `${ENDPOINT_WEB}/xem-phim/${slug}`,
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-[#1a1a1a] pt-20"
      >
        <div className="relative">
          <PullToRefresh onRefresh={fetchMovie} />
          <MainBackMobile
            title={
              movie.name +
              " - " +
              episodes[activeServer]?.server_data[activeEpisode].name
            }
            className="px-2 md:px-10"
            titleClassName="text-lg md:text-2xl font-bold text-white"
          />
          <div className="">
            {/* Video Player */}
            <motion.div
              variants={itemVariants}
              className="mb-8 px-4 md:px-6 lg:px-8"
            >
              <div className="relative pt-[56.25%] bg-black rounded-xl sm:rounded-2xl md:rounded-3xl border border-[#202020] overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
                {isLoading ? (
                  <Loading />
                ) : (
                  <iframe
                    ref={videoPlayerRef}
                    id="videoPlayer"
                    src={
                      episodes[activeServer]?.server_data[activeEpisode]
                        ?.link_embed
                    }
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full border-none"
                  />
                )}
              </div>
            </motion.div>

            {/* Watch tools */}
            <motion.div
              variants={itemVariants}
              className=" px-4 md:px-10 container mx-auto"
            >
              <div className="flex justify-end items-center">
                <div className="flex items-center">
                  <div className="relative" ref={shareRef}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsShareOpen(!isShareOpen)}
                      className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center gap-2 shadow-lg"
                    >
                      <Share2 className="w-5 h-5" />
                      Chia sẻ
                    </motion.button>
                    <AnimatePresence>
                      {isShareOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute -left-20 mt-2 w-48 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl z-50"
                        >
                          <div className="py-2">
                            <ListView
                              data={shareProps}
                              render={(item) => (
                                <motion.a
                                  whileHover={{ x: 5 }}
                                  href={
                                    item.url +
                                    (Capacitor.isNativePlatform()
                                      ? ENDPOINT_WEB + "/xem-phim/" + slug
                                      : window.location.href)
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center px-4 py-2 text-gray-300 hover:bg-red-600/10 transition-colors duration-200 space-x-2"
                                  onClick={() => setIsShareOpen(false)}
                                >
                                  {item.icon}
                                  <span>{item.title}</span>
                                </motion.a>
                              )}
                            />
                            <motion.button
                              whileHover={{ x: 5 }}
                              onClick={copyLinkHandle}
                              className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-red-600/10 transition-colors duration-200"
                            >
                              <Copy className="w-5 h-5 mr-2 text-red-500" />
                              Sao chép link
                            </motion.button>
                            <motion.button
                              whileHover={{ x: 5 }}
                              onClick={handleShare}
                              className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-red-600/10 transition-colors duration-200"
                            >
                              <Share2 className="w-5 h-5 mr-2 text-red-500" />
                              Chia sẻ
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="px-4 md:px-10 container mx-auto">
              {/* Server Tabs */}
              <motion.div variants={itemVariants} className="">
                <div className="border-b border-[#2a2a2a]">
                  <ul className="flex flex-wrap -mb-px" role="tablist">
                    {episodes.map((server, index) => (
                      <motion.li
                        key={index}
                        className="mr-2"
                        role="presentation"
                        whileHover={{ y: -2 }}
                      >
                        <button
                          className={`inline-block p-4 border-b-2 rounded-t-lg transition-all duration-200 ease-in-out ${
                            index === activeServer
                              ? "border-red-600 text-red-600"
                              : "border-transparent text-gray-400 hover:text-gray-300 hover:border-[#2a2a2a]"
                          }`}
                          onClick={() => handleServerChange(index)}
                          role="tab"
                        >
                          {server.server_name}
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Episode List */}
                <motion.div variants={itemVariants} className="mt-8">
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-3">
                    {episodes[activeServer]?.server_data
                      .slice(0, showAllEpisodes ? undefined : 12)
                      .map((episode, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2.5 rounded-lg border transition-all duration-200 ease-in-out ${
                            index === activeEpisode
                              ? "bg-gradient-to-r from-red-600 to-red-700 text-white border-red-600"
                              : "border-[#2a2a2a] text-gray-300 hover:bg-[#1a1a1a]"
                          }`}
                          onClick={() =>
                            handleEpisodeChange(index, episode.link_embed)
                          }
                        >
                          {episode.name}
                        </motion.button>
                      ))}
                  </div>

                  {episodes[activeServer]?.server_data.length > 12 && (
                    <motion.div
                      variants={itemVariants}
                      className="mt-6 flex justify-center"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAllEpisodes(!showAllEpisodes)}
                        className="px-8 py-2 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] text-white rounded-lg border border-[#2a2a2a] hover:from-[#2a2a2a] hover:to-[#3a3a3a] transition-all duration-200 shadow-lg"
                      >
                        {showAllEpisodes ? "Ẩn bớt" : "Xem thêm"}
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>

              <AnimatePresence mode="wait">
                {movieDetails && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="pt-8"
                  >
                    <FilmDetailsCard movieDetails={movieDetails} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Suspense
              fallback={
                <div className="w-full flex items-center justify-center">
                  <Loader className="w-8 h-8 text-red-500 animate-spin" />
                </div>
              }
            >
              <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 pt-4 sm:pt-6 md:pt-8 lg:pt-12">
                <FilmRenderSection
                  movies={moviesSuggest}
                  title="Gợi ý"
                  titleClassName="bg-gradient-to-r from-blue-400 via-white to-blue-300"
                  borderLeftColor="border-blue-400"
                />
              </div>
            </Suspense>
            <Suspense
              fallback={
                <div className="w-full flex items-center justify-center">
                  <Loader className="w-8 h-8 text-red-500 animate-spin" />
                </div>
              }
            >
              <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 pt-4 sm:pt-6 md:pt-8 lg:pt-12">
                <FilmRenderSection
                  movies={filmIntro}
                  title="Phim mới cập nhật"
                  titleClassName="bg-gradient-to-r from-pink-400 via-white to-pink-300"
                  borderLeftColor="border-pink-400"
                />
              </div>
            </Suspense>
          </div>
        </div>
      </motion.div>
    </HelmetSEO>
  );
};

export default WatchFilmPage;
