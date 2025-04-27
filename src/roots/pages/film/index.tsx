import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronLeft, ChevronRight, Film } from "lucide-react";
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
  const {
    isLoading: isLoadingSystem,
    countries,
    genres,
    scrollToTop,
  } = useSystemContext();
  const topRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { filmUpdateResponse, loadMovies } = useFilmContext();
  const getFilmsTypeRef = useRef<GetFilmsType | null>(null);
  const moviesChangeCount = useRef(0);

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
  const searchMovies = async (
    type: GetFilmsType,
    value: string,
    page: number = 1
  ) => {
    moviesChangeCount.current++;
    getFilmsTypeRef.current = type;
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
        page,
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
  const paginationHandle = async (page: number) => {
    moviesChangeCount.current++;
    if (getFilmsTypeRef.current === null) {
      await loadMovies(
        page,
        () => {
          setLoading(true);
        },
        () => {
          setLoading(false);
        }
      );
      return;
    }
    let value = "";
    if (getFilmsTypeRef.current === GetFilmsType.COUNTRY) {
      value = selectedCountry;
    } else if (getFilmsTypeRef.current === GetFilmsType.GENRE) {
      value = selectedGenre;
    } else if (getFilmsTypeRef.current === GetFilmsType.YEAR) {
      value = selectedYear;
    } else if (getFilmsTypeRef.current === GetFilmsType.LIST) {
      value = selectedType;
    }
    await searchMovies(getFilmsTypeRef.current, value, page);
  };
  useEffect(() => {
    if (filmUpdateResponse) {
      setMovies(filmUpdateResponse.items);
      setCurrentPage(filmUpdateResponse.pagination.currentPage);
      setTotalPages(filmUpdateResponse.pagination.totalPages);
    }
  }, [filmUpdateResponse]);
  useEffect(() => {
    if (getFilmsTypeRef.current) {
      if (
        selectedCountry === "all" &&
        selectedGenre === "all" &&
        selectedType === FilmTypeList.ALL &&
        selectedYear === "all"
      ) {
        getFilmsTypeRef.current = null;
      }
    }
  }, [selectedCountry, selectedGenre, selectedType, selectedYear]);

  useEffect(() => {
    if (topRef.current && moviesChangeCount.current > 0) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      scrollToTop();
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
        <PullToRefresh
          onRefresh={async () => {
            window.location.reload();
          }}
        />
        {/* Loading Overlay */}
        {loading ? <Loading /> : isLoadingSystem ? <Loading /> : null}
        <FilmIntroSlider />
        <main className=" px-4">
          <div ref={topRef} className="w-0 h-0" />
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
          <h1 className=" text-3xl font-bold text-white py-4 flex items-center gap-2 border-l-4 border-red-600 pl-4">
            <Film className="w-8 h-8" />
            <span className="title-hover">Danh sách</span>
          </h1>
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
                    "bg-gradient-to-r from-red-600 to-orange-600",
                    "bg-gradient-to-r from-orange-600 to-amber-600",
                    "bg-gradient-to-r from-amber-600 to-yellow-600",
                    "bg-gradient-to-r from-yellow-600 to-orange-500",
                    "bg-gradient-to-r from-orange-500 to-red-500",
                  ];
                  return (
                    <Link
                      key={type}
                      to={`/danh-sach/${type}`}
                      className={`${
                        bgColors[index % bgColors.length]
                      } px-6 py-3 rounded-lg 
                    hover:scale-105 transition-all duration-300 ease-in-out
                    shadow-lg hover:shadow-orange-500/20
                    border border-orange-900/30
                    whitespace-nowrap
                    text-white font-medium items-start justify-center md:py-10 md:px-20 flex flex-col`}
                    >
                      <h3 className="text-xl font-bold">
                        {transFilmTypeToVN(type)}
                      </h3>
                      <h4 className="flex items-center gap-2">
                        Xem thể loại
                        <ChevronRight className="w-6 h-6" />
                      </h4>
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
          <h1 className=" text-3xl font-bold text-white py-4 flex items-center gap-2 border-l-4 border-red-600 pl-4 mb-2">
            <Film className="w-8 h-8" />
            <span className="title-hover">Phim Mới Hôm Nay</span>
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
            loadMovies={paginationHandle}
          />
        </main>
      </div>
      <UpdateAppSheet />
    </>
  );
};

export default FilmPage;
