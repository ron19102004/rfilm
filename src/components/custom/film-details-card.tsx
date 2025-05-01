import { MovieDetails, MovieDetailsResponse } from "@/apis/index.d";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
interface FilmDetailsCardProps {
  movieDetails: MovieDetailsResponse;
  className?: string;
}

const FilmDetailsCard: React.FC<FilmDetailsCardProps> = ({
  movieDetails,
  className,
}) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  useEffect(() => {
    setMovie(movieDetails.movie);
  }, [movieDetails]);
  if (!movie) return null;
  return (
    <div className={cn(className)}>
      {/* Movie Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 ">
        {/* Movie Content */}
        <div className="lg:col-span-2" data-aos="fade-up" data-aos-delay="200">
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl  p-8 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg h-full">
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
              <img
                src={movie.poster_url}
                alt={movie.name}
                className="w-full h-96 md:w-60 md:h-96 object-cover rounded-2xl shadow-2xl transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
              />
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {movie.name}
                </h1>
                <p className="text-gray-400 text-2xl mb-4">
                  {movie.origin_name}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#3a3a3a] rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm mb-1">Năm</p>
                    <p className="text-white font-medium">{movie.year}</p>
                  </div>
                  <div className="bg-[#3a3a3a] rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm mb-1">Thời lượng</p>
                    <p className="text-white font-medium">{movie.time}</p>
                  </div>
                  <div className="bg-[#3a3a3a] rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm mb-1">Chất lượng</p>
                    <p className="text-white font-medium">{movie.quality}</p>
                  </div>
                  <div className="bg-[#3a3a3a] rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm mb-1">Trạng thái</p>
                    <p className="text-white font-medium">
                      <StatusRender status={movie.status} />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-white">
              Nội dung phim
            </h2>
            <p
              className="text-gray-300 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: movie.content }}
            ></p>
          </div>
        </div>

        {/* Movie Details */}
        <div className="lg:col-span-1" data-aos="fade-up" data-aos-delay="300">
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl  p-8 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg h-full">
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
                      {movie.country.map((c, index) => (
                        <span key={index}>
                          <Link to={"/quoc-gia/" + c.slug}>{c.name}, </Link>
                        </span>
                      ))}
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
                    <Link to={`/the-loai/${cat.slug}`}>
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 transition-colors duration-200"
                      >
                        {cat.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Movie Info */}
      <div
        className="mt-4 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl  p-6 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-white">Ngôn ngữ</h3>
          <p className="text-gray-300">{movie.lang}</p>
        </div>
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl  p-6 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-white">Đạo diễn</h3>
          <p className="text-gray-300">{movie.director.join(", ")}</p>
        </div>
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl  p-6 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-white">Quốc gia</h3>
          <p className="text-gray-300">
            {movie.country.map((c, index) => (
              <span key={index}>
                <Link to={"/quoc-gia/" + c.slug}>{c.name}, </Link>
              </span>
            ))}
          </p>
        </div>
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl  p-6 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-white">Lượt xem</h3>
          <p className="text-gray-300">{movie.view.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
const StatusRender: React.FC<{ status: string }> = ({ status }) => {
  if (status === "ongoing") {
    return (
      <span className="inline-flex items-center px-4 py-2 rounded-full text-green-500 font-medium text-sm transition-all duration-300 hover:bg-green-600/20 hover:scale-105">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
        Đang chiếu
      </span>
    );
  } else if (status === "completed") {
    return (
      <span className="inline-flex items-center px-4 py-2 rounded-full  text-blue-500 font-medium text-sm transition-all duration-300 hover:bg-blue-600/20 hover:scale-105">
        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
        Đã hoàn thành
      </span>
    );
  } else if (status === "upcoming") {
    return (
      <span className="inline-flex items-center px-4 py-2 rounded-full  text-yellow-500 font-medium text-sm transition-all duration-300 hover:bg-yellow-600/20 hover:scale-105">
        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
        Sắp ra mắt
      </span>
    );
  }
  return null;
};
export default FilmDetailsCard;
