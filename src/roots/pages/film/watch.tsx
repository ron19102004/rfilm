import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "@/components/custom/loading";
import PullToRefresh from "@/components/custom/pull_to_refresh";

interface Movie {
  name: string;
  origin_name: string;
  year: string;
  time: string;
  quality: string;
  status: string;
  content: string;
  director: string[];
  country: { name: string }[];
  lang: string;
  rating: string;
  view: number;
  actor: string[];
  category: { name: string }[];
  poster_url: string;
}

interface Episode {
  name: string;
  link_embed: string;
}

interface Server {
  server_name: string;
  server_data: Episode[];
}

interface MovieResponse {
  status: boolean;
  movie: Movie;
  episodes: Server[];
}

const WatchFilmPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [episodes, setEpisodes] = useState<Server[]>([]);
  const [activeServer, setActiveServer] = useState(0);
  const [activeEpisode, setActiveEpisode] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`https://phimapi.com/phim/${slug}`);
        const data: MovieResponse = await response.json();

        if (data.status) {
          setMovie(data.movie);
          setEpisodes(data.episodes);
          setIsLoading(false);
        } else {
          setError("Failed to load movie data");
          setIsLoading(false);
        }
      } catch (err) {
        setError("An error occurred while fetching the movie");
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [slug]);
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [movie]);

  const handleServerChange = (index: number) => {
    setActiveServer(index);
    setActiveEpisode(0);
  };

  const handleEpisodeChange = (index: number, embedUrl: string) => {
    setActiveEpisode(index);
    const videoPlayer = document.getElementById(
      "videoPlayer"
    ) as HTMLIFrameElement;
    if (videoPlayer) {
      videoPlayer.src = embedUrl;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Error</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="bg-[#0a0a0a] h-full">
      <PullToRefresh/>
      <div ref={topRef} className="w-0 h-0" />
      <div className="container mx-auto">
        {/* Video Player */}
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12" data-aos="fade-up">
          <div className="relative pt-[56.25%] bg-black rounded-lg sm:rounded-xl md:rounded-2xl border border-[#202020] overflow-hidden mx-2 sm:mx-4 md:mx-6 lg:mx-8">
            {isLoading ? (
              <Loading />
            ) : (
              <iframe
                id="videoPlayer"
                src={
                  episodes[activeServer]?.server_data[activeEpisode]?.link_embed
                }
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none' }}
                className="absolute top-0 left-0 w-full h-full border-none"
              ></iframe>
            )}
          </div>
        </div>

        {/* Server Tabs */}
        <div className="mb-12" data-aos="fade-up" data-aos-delay="100">
          <div className="border-b border-[#2a2a2a]">
            <ul className="flex flex-wrap -mb-px" role="tablist">
              {episodes.map((server, index) => (
                <li key={index} className="mr-2" role="presentation">
                  <button
                    className={`inline-block p-4 border-b-2 rounded-t-lg transition-all duration-200 ease-in-out hover:-translate-y-0.5 ${
                      index === activeServer
                        ? "border-red-600 text-red-600"
                        : "border-transparent text-gray-400 hover:text-gray-300 hover:border-[#2a2a2a]"
                    }`}
                    onClick={() => handleServerChange(index)}
                    role="tab"
                  >
                    {server.server_name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Episode List */}
          <div className="mt-8">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-12 gap-3">
              {episodes[activeServer]?.server_data.slice(0, showAllEpisodes ? undefined : 12).map((episode, index) => (
                <button
                  key={index}
                  className={`px-5 py-2.5 rounded-lg border transition-all duration-200 ease-in-out hover:-translate-y-0.5 ${
                    index === activeEpisode
                      ? "bg-red-600 text-white border-red-600"
                      : "border-[#2a2a2a] text-gray-300 hover:bg-[#1a1a1a]"
                  }`}
                  onClick={() => handleEpisodeChange(index, episode.link_embed)}
                >
                  {episode.name}
                </button>
              ))}
            </div>
            
            {episodes[activeServer]?.server_data.length > 12 && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowAllEpisodes(!showAllEpisodes)}
                  className="px-6 py-2 bg-[#1a1a1a] text-white rounded-lg border border-[#2a2a2a] hover:bg-[#2a2a2a] transition-all duration-200"
                >
                  {showAllEpisodes ? "Ẩn bớt" : "Xem thêm"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Movie Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie Content */}
          <div
            className="lg:col-span-2"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl p-8 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
                <img
                  src={movie.poster_url}
                  alt={movie.name}
                  className="w-48 h-72 object-cover rounded-2xl shadow-2xl transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
                />
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {movie.name}
                  </h1>
                  <p className="text-gray-400 text-2xl mb-4">
                    {movie.origin_name}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#2a2a2a] rounded-xl p-4 text-center">
                      <p className="text-gray-400 text-sm mb-1">Năm</p>
                      <p className="text-white font-medium">{movie.year}</p>
                    </div>
                    <div className="bg-[#2a2a2a] rounded-xl p-4 text-center">
                      <p className="text-gray-400 text-sm mb-1">Thời lượng</p>
                      <p className="text-white font-medium">{movie.time}</p>
                    </div>
                    <div className="bg-[#2a2a2a] rounded-xl p-4 text-center">
                      <p className="text-gray-400 text-sm mb-1">Chất lượng</p>
                      <p className="text-white font-medium">{movie.quality}</p>
                    </div>
                    <div className="bg-[#2a2a2a] rounded-xl p-4 text-center">
                      <p className="text-gray-400 text-sm mb-1">Trạng thái</p>
                      <p className="text-white font-medium">{movie.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-6 text-white">
                Nội dung phim
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {movie.content}
              </p>
            </div>
          </div>

          {/* Movie Details */}
          <div
            className="lg:col-span-1"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl p-8 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-xl mb-3 text-white">
                    Thông tin phim
                  </h3>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Đạo diễn:</span>
                      <span className="text-white">
                        {movie.director.join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Quốc gia:</span>
                      <span className="text-white">
                        {movie.country.map((c) => c.name).join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Ngôn ngữ:</span>
                      <span className="text-white">{movie.lang}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Đánh giá:</span>
                      <span className="text-white">{movie.rating} / 10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Lượt xem:</span>
                      <span className="text-white">
                        {movie.view.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-xl mb-3 text-white">
                    Diễn viên
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.actor.map((actor, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-[#2a2a2a] text-gray-300 rounded-full text-sm hover:bg-[#1a1a1a] transition-colors duration-200"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-xl mb-3 text-white">
                    Thể loại
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.category.map((cat, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 transition-colors duration-200"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Movie Info */}
        <div
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl p-6 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-white">Ngôn ngữ</h3>
            <p className="text-gray-300">{movie.lang}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl p-6 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-white">Đạo diễn</h3>
            <p className="text-gray-300">{movie.director.join(", ")}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl p-6 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-white">Quốc gia</h3>
            <p className="text-gray-300">
              {movie.country.map((c) => c.name).join(", ")}
            </p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl p-6 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-white">Lượt xem</h3>
            <p className="text-gray-300">{movie.view.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchFilmPage;
