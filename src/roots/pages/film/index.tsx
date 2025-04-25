import React, { useState, useEffect, useRef } from "react";
import { Search, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import Loading from "@/components/custom/loading";

interface Movie {
  name: string;
  origin_name: string;
  poster_url: string;
  quality: string;
  episode_current: string;
  year: string;
  time: string;
  lang: string;
  category: Array<{ name: string }>;
  country: Array<{ name: string }>;
  slug: string;
}

interface Country {
  slug: string;
  name: string;
}

interface Genre {
  slug: string;
  name: string;
}

const FilmPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const navigate = useNavigate();
  const topRef = useRef<HTMLDivElement>(null);

  // Load countries
  const loadCountries = async () => {
    try {
      const response = await fetch("https://phimapi.com/quoc-gia");
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error("Error loading countries:", error);
    }
  };

  // Load genres
  const loadGenres = async () => {
    try {
      const response = await fetch("https://phimapi.com/the-loai");
      const data = await response.json();
      setGenres(data);
    } catch (error) {
      console.error("Error loading genres:", error);
    }
  };

  // Load movies
  const loadMovies = async (page = 1) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://phimapi.com/danh-sach/phim-moi-cap-nhat-v3?page=${page}`
      );
      const data = await response.json();
      if (data.status) {
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
        setMovies(data.items);
      }
    } catch (error) {
      console.error("Error loading movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search movies
  const searchMovies = async (type: string) => {
    if (loading) return;
    setLoading(true);

    let url = "https://phimapi.com/v1/api";

    if (type === "country") {
      url += `/quoc-gia/${selectedCountry}?page=1&sort_field=_id&sort_type=asc&category=${selectedGenre}&year=${selectedYear}&limit=20`;
    } else if (type === "genre") {
      url += `/the-loai/${selectedGenre}?page=1&sort_field=_id&sort_type=asc&sort_lang=long-tieng&country=${selectedCountry}&year=${selectedYear}&limit=20`;
    } else if (type === "year") {
      url += `/nam/${selectedYear}?page=1&sort_field=_id&sort_type=asc&sort_lang=long-tieng&category=${selectedGenre}&country=${selectedCountry}&limit=20`;
    } else {
      navigate(`/tim-kiem?keyword=${searchKeyword}&page=1`);
      return;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "success") {
        setCurrentPage(data.data.params.pagination.currentPage);
        setTotalPages(data.data.params.pagination.totalPages);
        setMovies(data.data.items);
      }
    } catch (error) {
      console.error("Error searching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Render pagination
  const renderPagination = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];

    // Previous button
    pages.push(
      <Button
        key="prev"
        onClick={() => currentPage > 1 && loadMovies(currentPage - 1)}
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <Button
          key="first"
          onClick={() => loadMovies(1)}
          variant="outline"
          size="sm"
          className="h-8 w-8"
        >
          1
        </Button>
      );
      if (startPage > 2) {
        pages.push(
          <span
            key="dots1"
            className="flex h-8 w-8 items-center justify-center text-gray-400"
          >
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => loadMovies(i)}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          className="h-8 w-8"
        >
          {i}
        </Button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span
            key="dots2"
            className="flex h-8 w-8 items-center justify-center text-gray-400"
          >
            ...
          </span>
        );
      }
      pages.push(
        <Button
          key="last"
          onClick={() => loadMovies(totalPages)}
          variant="outline"
          size="sm"
          className="h-8 w-8"
        >
          {totalPages}
        </Button>
      );
    }

    // Next button
    pages.push(
      <Button
        key="next"
        onClick={() => currentPage < totalPages && loadMovies(currentPage + 1)}
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );

    return pages;
  };

  useEffect(() => {
    loadCountries();
    loadGenres();
    loadMovies();
  }, []);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [movies]);

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div ref={topRef} className="w-0 h-0"/>
      {/* Loading Overlay */}
      {loading && <Loading />}

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4" data-aos="fade-down">
          <h1 className="text-3xl font-bold text-white">Phim Mới Cập Nhật</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="text"
                value={searchKeyword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchKeyword(e.target.value)
                }
                placeholder="Tìm kiếm phim..."
                className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-white focus-visible:ring-red-600"
              />
              <Search className="absolute left-2 top-2 text-gray-400 w-5 h-5" />
            </div>
            <Button
              onClick={() => searchMovies("search")}
              className="bg-red-600 hover:bg-red-700"
            >
              <Search className="w-5 h-5 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8 flex flex-wrap gap-4" data-aos="fade-up" data-aos-delay="100">
          <Select
            value={selectedGenre}
            onValueChange={(value: string) => {
              setSelectedGenre(value);
              searchMovies("genre");
            }}
          >
            <SelectTrigger className="w-[180px] bg-[#1a1a1a] border-[#2a2a2a] text-white">
              <SelectValue placeholder="Thể loại" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
              <SelectItem value="all">Tất cả</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre.slug} value={genre.slug}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedCountry}
            onValueChange={(value: string) => {
              setSelectedCountry(value);
              searchMovies("country");
            }}
          >
            <SelectTrigger className="w-[180px] bg-[#1a1a1a] border-[#2a2a2a] text-white">
              <SelectValue placeholder="Quốc gia" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
              <SelectItem value="all">Tất cả</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country.slug} value={country.slug}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedYear}
            onValueChange={(value: string) => {
              setSelectedYear(value);
              searchMovies("year");
            }}
          >
            <SelectTrigger className="w-[180px] bg-[#1a1a1a] border-[#2a2a2a] text-white">
              <SelectValue placeholder="Năm" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
              <SelectItem value="all">Tất cả</SelectItem>
              {Array.from(
                { length: new Date().getFullYear() - 1970 + 1 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.length === 0 ? (
            <div className="col-span-full text-center py-8" data-aos="fade-up">
              <p className="text-gray-400">Không tìm thấy phim nào phù hợp</p>
            </div>
          ) : (
            movies.map((movie, index) => (
              <Card
                key={movie.slug}
                className="bg-[#1a1a1a] border-[#2a2a2a] overflow-hidden transition-all duration-300 hover:-translate-y-1 py-0"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative group">
                  <img
                    src={movie.poster_url}
                    alt={movie.name}
                    className="w-full h-80 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute top-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-sm">
                    {movie.quality}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/75 text-white px-2 py-1 rounded text-sm">
                    {movie.episode_current}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <Button className="opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-red-600 hover:bg-red-700">
                      <Link
                        to={`/xem-phim/${movie.slug}`}
                        className="flex items-center"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Xem ngay
                      </Link>
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 truncate">
                    {movie.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {movie.origin_name}
                  </p>
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
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center" data-aos="fade-up" data-aos-delay="200">
          <div className="flex items-center gap-1">
            {renderPagination().map((page, index) => (
              <div key={index}>{page}</div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FilmPage;
