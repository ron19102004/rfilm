import { Movie } from "@/apis";
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { URL_IMG } from "@/constant/api.constant";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  index?: number;
}
const MovieCard: React.FC<MovieCardProps> = ({ movie, index = 1 }) => {
  return (
    <Card
      key={movie.slug}
      className="bg-[#1a1a1a] border-[#2a2a2a] overflow-hidden transition-all duration-300 hover:-translate-y-1 py-0"
      data-aos="fade-up"
      data-aos-delay={index * 100}
    >
      <div className="relative group">
        <Link to={`/xem-phim/${movie.slug}`}>
          <img
            src={
              movie.poster_url.startsWith("https") ||
              movie.poster_url.startsWith("https")
                ? movie.poster_url
                : `${URL_IMG}${movie.poster_url}`
            }
            alt={movie.name}
            className="w-full h-80 object-cover group-hover:opacity-90 transition-opacity"
          />
        </Link>

        <div className="absolute top-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-sm">
          {movie.quality}
        </div>
        <div className="absolute bottom-2 left-2 bg-black/75 text-white px-2 py-1 rounded text-sm">
          {movie.episode_current}
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <Button className="opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-red-600 hover:bg-red-700">
            <Link to={`/xem-phim/${movie.slug}`} className="flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Xem ngay
            </Link>
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 truncate">
          <Link to={`/xem-phim/${movie.slug}`}>{movie.name}</Link>
        </h3>
        <p className="text-sm text-gray-400 mb-2">{movie.origin_name}</p>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <span>{movie.year}</span>
          <span>•</span>
          <span>{movie.time}</span>
          <span>•</span>
          <span>{movie.lang}</span>
        </div>
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
      </CardContent>
    </Card>
  );
};

export default MovieCard;
