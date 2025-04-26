import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSystemContext } from "@/context";
import { Link } from "react-router-dom";

const FilmIntroSlider: React.FC = () => {
  const { filmIntro } = useSystemContext();
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

  if (!filmIntro || filmIntro.length === 0) {
    return (
      <div className="w-full mx-auto px-4 py-2">
        <Slider {...settings}>
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </Slider>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 py-2">
      <Slider {...settings}>
        {filmIntro.map((movie, index) => (
          <div key={index} className="p-2">
            <div className="bg-[#1a1a1a] border border-[#424242] shadow-lg rounded-lg overflow-hidden group hover:border-red-500 transition-all duration-300">
              <div className="relative">
                <img
                  src={movie.poster_url}
                  alt={movie.name}
                  className="w-full h-64 object-cover group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                  {movie.year}
                </div>
              </div>
              <div className="p-4">
                <Link to={`/xem-phim/${movie.slug}`} className="block">
                  <h3 className="text-lg font-semibold text-white hover:text-red-500 transition-colors">
                    {movie.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {movie.origin_name}
                  </p>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FilmIntroSlider;
