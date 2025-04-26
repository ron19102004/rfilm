import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
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
import PullToRefresh from "@/components/custom/pull_to_refresh";
import { useFilmContext, useSystemContext } from "@/context";
import { FilmTypeList, GetFilmsType, Movie } from "@/apis/index.d";
import ListView from "@/components/list";
import MovieCard from "@/components/custom/movie_card";
import filmApi from "@/apis/film.api";
import { transFilmTypeToEN, transFilmTypeToVN } from "@/apis/trans.f";
import Pagination from "@/components/custom/pagination";
import FilmIntroSlider from "@/components/custom/film_intro";
import UpdateAppSheet from "@/components/custom/update_app_sheet";

const FilmPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedType, setSelectedType] = useState<FilmTypeList>(
    FilmTypeList.ALL
  );
  const navigate = useNavigate();
  const { isLoading: isLoadingSystem, countries, genres } = useSystemContext();
  const topRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { filmUpdateResponse, loadMovies } = useFilmContext();

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

  // Search movies
  const searchMovies = async (type: GetFilmsType, value: string) => {
    if (loading) return;
    if (type === GetFilmsType.KEYWORD) {
      navigate(`/tim-kiem?keyword=${value}&page=1`);
      return;
    }
    setLoading(true);
    try {
      const response = await filmApi.getFilmsBy({
        type,
        value,
        page: 1,
        selectedCountry: selectedCountry,
        selectedGenre: selectedGenre,
        selectedYear: selectedYear,
      });

      if (response.status === "success") {
        setCurrentPage(response.data.params.pagination.currentPage);
        setTotalPages(response.data.params.pagination.totalPages);
        setMovies(response.data.items);
      }
    } catch (error) {
      console.error("Error searching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filmUpdateResponse) {
      setMovies(filmUpdateResponse.items);
      setCurrentPage(filmUpdateResponse.pagination.currentPage);
      setTotalPages(filmUpdateResponse.pagination.totalPages);
    }
  }, [filmUpdateResponse]);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [movies]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 200;
      checkScroll();
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 200;
      checkScroll();
    }
  };

  return (
    <>
      <div className="bg-[#0a0a0a] min-h-screen">
        <div ref={topRef} className="w-0 h-0" />
        <PullToRefresh
          onRefresh={async () => {
            window.location.reload();
          }}
        />
        {/* Loading Overlay */}
        {loading ? <Loading /> : isLoadingSystem ? <Loading /> : null}

        <main className="container mx-auto px-4">
          {/* Search */}
          <div className="py-4 flex justify-end items-center">
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
                onClick={() =>
                  searchMovies(GetFilmsType.KEYWORD, searchKeyword)
                }
                className="bg-red-600 hover:bg-red-700"
              >
                <Search className="w-5 h-5 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </div>
          <FilmIntroSlider />
          <h1 className="text-3xl font-bold text-white py-4">Danh sách</h1>
          <div className="text-white overflow-hidden scrollbar-hide relative">
            <div
              className="flex gap-4 overflow-x-auto py-4 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              ref={scrollContainerRef}
            >
              <ListView
                data={Object.values(FilmTypeList).filter(
                  (item) => item !== FilmTypeList.ALL
                )}
                render={(type, index) => {
                  const bgColors = [
                    "bg-gradient-to-r from-red-900 to-red-800",
                    "bg-gradient-to-r from-red-800 to-red-700",
                    "bg-gradient-to-r from-red-700 to-red-600",
                    "bg-gradient-to-r from-red-600 to-red-500",
                    "bg-gradient-to-r from-red-500 to-red-400",
                  ];
                  return (
                    <Link
                      key={type}
                      to={`/danh-sach/${type}`}
                      className={`${
                        bgColors[index % bgColors.length]
                      } px-6 py-3 rounded-lg 
                    hover:scale-105 transition-all duration-300 ease-in-out
                    shadow-lg hover:shadow-red-500/20
                    border border-red-900/30
                    whitespace-nowrap
                    text-white font-medium flex items-center justify-center md:py-10 md:px-20`}
                    >
                      {transFilmTypeToVN(type)}
                    </Link>
                  );
                }}
              />
            </div>
            {/* Scroll Buttons */}
            <button
              onClick={scrollLeft}
              className={`absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-r-lg hidden  ${
                canScrollLeft ? "md:block" : "hidden"
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollRight}
              className={`absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-l-lg hidden ${
                canScrollRight ? "md:block" : "hidden"
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <h1 className="text-3xl font-bold text-white py-4">
            Phim Mới Cập Nhật
          </h1>
          {/* Filter Section */}
          <div
            className="mb-8 grid grid-cols-2 md:flex md:flex-row gap-4"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">Danh sách</label>
              <Select
                value={selectedType}
                onValueChange={(value: string) => {
                  setSelectedType(transFilmTypeToEN(value));
                  searchMovies(GetFilmsType.LIST, value);
                }}
              >
                <SelectTrigger className="w-full md:w-[180px] bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectValue placeholder="Danh sách" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <ListView
                    data={Object.values(FilmTypeList)}
                    render={(type) => (
                      <SelectItem key={type} value={type}>
                        {transFilmTypeToVN(type)}
                      </SelectItem>
                    )}
                  />
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">Thể loại</label>
              <Select
                value={selectedGenre}
                onValueChange={(value: string) => {
                  setSelectedGenre(value);
                  searchMovies(GetFilmsType.GENRE, value);
                }}
              >
                <SelectTrigger className="w-full md:w-[180px] bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectValue placeholder="Thể loại" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectItem value="all">Tất cả</SelectItem>
                  <ListView
                    data={genres}
                    render={(genre) => (
                      <SelectItem key={genre.slug} value={genre.slug}>
                        {genre.name}
                      </SelectItem>
                    )}
                  />
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">Quốc gia</label>
              <Select
                value={selectedCountry}
                onValueChange={(value: string) => {
                  setSelectedCountry(value);
                  searchMovies(GetFilmsType.COUNTRY, value);
                }}
              >
                <SelectTrigger className="w-full md:w-[180px] bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectValue placeholder="Quốc gia" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectItem value="all">Tất cả</SelectItem>
                  <ListView
                    data={countries}
                    render={(country) => (
                      <SelectItem key={country.slug} value={country.slug}>
                        {country.name}
                      </SelectItem>
                    )}
                  />
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">Năm</label>
              <Select
                value={selectedYear}
                onValueChange={(value: string) => {
                  setSelectedYear(value);
                  searchMovies(GetFilmsType.YEAR, value);
                }}
              >
                <SelectTrigger className="w-full md:w-[180px] bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectValue placeholder="Năm" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectItem value="all">Tất cả</SelectItem>
                  <ListView
                    data={Array.from(
                      { length: new Date().getFullYear() - 1970 + 1 },
                      (_, i) => new Date().getFullYear() - i
                    )}
                    render={(year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    )}
                  />
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Movie Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.length === 0 ? (
              <div
                className="col-span-full text-center py-8"
                data-aos="fade-up"
              >
                <p className="text-gray-400">Không tìm thấy phim nào phù hợp</p>
              </div>
            ) : (
              <ListView
                data={movies}
                render={(movie, index) => (
                  <MovieCard key={movie.slug} movie={movie} index={index} />
                )}
              />
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            loadMovies={(page) => {
              loadMovies(
                page,
                () => {
                  setLoading(true);
                },
                () => {
                  setLoading(false);
                }
              );
            }}
          />
        </main>
      </div>
      <UpdateAppSheet />
    </>
  );
};

export default FilmPage;
