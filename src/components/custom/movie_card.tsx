import { Movie } from "@/apis";
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { URL_IMG } from "@/constant/api.constant";
import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface MovieCardProps {
  movie: Movie;
  index?: number;
}
const MovieCard: React.FC<MovieCardProps> = ({ movie, index = 1 }) => {
  return (
    <HoverCard openDelay={1000} closeDelay={100}>
      <HoverCardTrigger className="transition-all duration-300">
        <Card
          key={movie.slug}
          className="bg-[#2a2a2a] border-[#2a2a2a] overflow-hidden transition-all duration-300 hover:-translate-y-1 py-0 h-full shadow-2xl"
          data-aos="fade-up"
          data-aos-delay={index * 50}
        >
          <div className="relative group">
            <Link to={`/chi-tiet-phim/${movie.slug}`}>
              <img
                src={
                  movie.poster_url.startsWith("https") ||
                  movie.poster_url.startsWith("https")
                    ? movie.poster_url
                    : `${URL_IMG}${movie.poster_url}`
                }
                alt={movie.name}
                className="w-full h-96 object-cover group-hover:opacity-90 transition-opacity"
              />
            </Link>

            <div className="absolute top-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-sm">
              {movie.quality}
            </div>
            <div className="absolute bottom-2 left-2 bg-black/75 text-white px-2 py-1 rounded text-sm">
              {movie.episode_current}
            </div>
            <div className="absolute inset-0 transition-all duration-300 flex items-center justify-center">
              <Link to={`/xem-phim/${movie.slug}`} className="">
                <Play className="w-24 h-24 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#2a2a2a]/60 rounded-full p-4" />
              </Link>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-white mb-2 truncate">
              <Link to={`/chi-tiet-phim/${movie.slug}`}>{movie.name}</Link>
            </h3>
            <p className="text-sm text-gray-400 mb-2">{movie.origin_name}</p>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.time}</span>
              <span>•</span>
              <span>{movie.lang}</span>
            </div>
            <div className="md:hidden">
              <div className="flex flex-wrap gap-2 mb-2">
                {movie.category.map((cat) => (
                  <span
                    key={cat.name}
                    className="px-2 py-1 bg-[#2a2a2a] text-gray-200 rounded-full text-xs"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.country.map((country) => (
                  <span
                    key={country.name}
                    className="px-2 py-1 bg-[#2a2a2a] text-gray-200 rounded-full text-xs"
                  >
                    {country.name}
                  </span>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 items-center justify-center">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-300 flex items-center justify-center gap-2 py-2 rounded-lg shadow-md hover:shadow-lg">
                  <Link
                    to={`/xem-phim/${movie.slug}`}
                    className="flex items-center justify-center w-full space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Xem ngay</span>
                  </Link>
                </Button>
                <Button className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white transition-all duration-300 flex items-center justify-center gap-2 py-2 rounded-lg shadow-md hover:shadow-lg">
                  <Link
                    to={`/chi-tiet-phim/${movie.slug}`}
                    className="flex items-center justify-center w-full space-x-2"
                  >
                    <Info className="w-5 h-5" />
                    <span>Chi tiết</span>
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent
        className="bg-[#1a1a1a] border-[#252525] w-96 hidden md:block space-y-4 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl"
        sideOffset={5}
      >
        <div className="w-full pb-2 relative transition-all duration-300">
          <Link to={`/chi-tiet-phim/${movie.slug}`}>
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
            <Link to={`/chi-tiet-phim/${movie.slug}`}>{movie.name}</Link>
          </h3>
          <p className="text-sm text-gray-400 mb-2">{movie.origin_name}</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="bg-[#2a2a2a] px-2 py-1 rounded">{movie.year}</span>
            <span>•</span>
            <span className="bg-[#2a2a2a] px-2 py-1 rounded">{movie.time}</span>
            <span>•</span>
            <span className="bg-[#2a2a2a] px-2 py-1 rounded">{movie.lang}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.category.map((cat) => (
              <span
                key={cat.name}
                className="px-3 py-1 bg-[#2a2a2a] text-gray-200 rounded-full text-xs hover:bg-[#3a3a3a] transition-colors"
              >
                {cat.name}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.country.map((country) => (
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
              className="flex items-center justify-center w-full space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Xem ngay</span>
            </Link>
          </Button>
          <Button className="w-full mt-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white transition-all duration-300 flex items-center justify-center gap-2 py-2 rounded-lg shadow-md hover:shadow-lg">
            <Link
              to={`/chi-tiet-phim/${movie.slug}`}
              className="flex items-center justify-center w-full space-x-2"
            >
              <Info className="w-5 h-5" />
              <span>Chi tiết</span>
            </Link>
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default MovieCard;
