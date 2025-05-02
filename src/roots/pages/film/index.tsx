import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Film,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import Loading from "@/components/custom/loading";
import PullToRefresh from "@/components/custom/pull-to-refresh";
import { useFilmContext, useSystemContext } from "@/context";
import { FilmTypeList, GetFilmsType, Movie } from "@/apis/index.d";
import ListView from "@/components/list";
import MovieCard from "@/components/custom/movie-card";
import filmApi from "@/apis/filmKK.api";
import { transFilmTypeToEN, transFilmTypeToVN } from "@/apis/trans.f";
import Pagination from "@/components/custom/pagination";
import FilmIntroSlider from "@/components/custom/film-intro";
import UpdateAppSheet from "@/components/custom/update-app-sheet";
import { MenuFilter } from "@/roots/layouts/partials/main-header";
import FilmRenderSection from "@/components/custom/film-render-section";
import HelmetSEO from "@/components/custom/helmet-seo";

const FilmPage: React.FC = () => {
  const {
    filmKorean,
    filmChina,
    filmHistoryVietNam,
    filmSchool,
    filmAnime,
    filmCriminal,
    filmHorrified,
  } = useFilmContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
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
    <HelmetSEO>
      <div className="min-h-screen">
        <PullToRefresh
          onRefresh={async () => {
            window.location.reload();
          }}
        />
        {/* Loading Overlay */}
        {loading ? <Loading /> : isLoadingSystem ? <Loading /> : null}
        <FilmIntroSlider />
        <main className="px-4">
          {/* Lọc theo */}
          <div className="flex items-center gap-4 lg:hidden">
            <h1 className="text-2xl md:text-3xl font-bold text-white py-4 flex items-center gap-2 border-l-4 border-gray-600 pl-4">
              <SlidersHorizontal className="w-8 h-8" />
              <span className="title-hover text-transparent bg-clip-text bg-gradient-to-r from-gray-500 via-white to-gray-600">
                Bộ lọc
              </span>
            </h1>
            <MenuFilter countries={countries} genres={genres} />
          </div>
          {/* Danh sách  */}
          <h1 className="text-2xl md:text-3xl font-bold text-white py-4 flex items-center gap-2 border-l-4 border-gray-600 pl-4">
            <Search className="w-8 h-8" />
            <span className="title-hover text-transparent bg-clip-text bg-gradient-to-r from-gray-500 via-white to-gray-600">
              Bạn đang quan tâm gì?
            </span>
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
                    "bg-gradient-to-r from-blue-800 via-blue-600 to-cyan-500",
                    "bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-500",
                    "bg-gradient-to-r from-rose-700 via-red-600 to-pink-500",
                    "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600",
                    "bg-gradient-to-r from-purple-800 via-violet-700 to-fuchsia-600",
                  ];
                  return (
                    <Link
                      key={type}
                      to={`/danh-sach/${type}`}
                      className={`${
                        bgColors[index % bgColors.length]
                      } rounded-lg 
                    hover:scale-105 transition-all duration-300 ease-in-out
                    shadow-lg whitespace-nowrap
                    text-white font-medium items-start justify-center py-10 md:py-12 px-10 md:px-20 flex flex-col`}
                    >
                      <h3 className="text-2xl font-bold">
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
          {/* Chủ đề việt nam  */}
          <FilmRenderSection
            movies={filmHistoryVietNam}
            title="Chiến Tranh Việt Nam"
            titleClassName="bg-gradient-to-r from-blue-400 via-white to-blue-300"
            borderLeftColor="border-blue-400"
          />
          {/* Chủ đề học đường  */}
          <FilmRenderSection
            href="/the-loai/hoc-duong"
            movies={filmSchool}
            title="Vườn Trường"
            titleClassName="bg-gradient-to-r from-orange-400 via-white to-orange-300"
            borderLeftColor="border-orange-400"
          />
          {/* Chủ đề hàn quốc  */}
          <FilmRenderSection
            href="/quoc-gia/han-quoc"
            movies={filmKorean}
            title="Hàn Quốc"
            titleClassName="bg-gradient-to-r from-purple-400 via-white to-purple-300"
            borderLeftColor="border-purple-400"
          />
          {/* Chủ đề trung quốc  */}
          <FilmRenderSection
            href="/quoc-gia/trung-quoc"
            movies={filmChina}
            title="Trung Quốc"
            titleClassName="bg-gradient-to-r from-yellow-400 via-white to-yellow-500"
            borderLeftColor="border-yellow-400"
          />
          {/* Chủ đề anime  */}
          <FilmRenderSection
            href="/danh-sach/hoat-hinh"
            movies={filmAnime}
            title="Anime"
            titleClassName="bg-gradient-to-r from-purple-400 via-white to-purple-300"
            borderLeftColor="border-purple-400"
          />
          {/* Chủ đề hình sự  */}
          <FilmRenderSection
            href="/the-loai/hinh-su"
            movies={filmCriminal}
            title="Hình Sự Gay Cấn"
            titleClassName="bg-gradient-to-r from-gray-400 via-white to-gray-300"
            borderLeftColor="border-gray-400"
          />
          {/* Chủ đề kinh dị  */}
          <FilmRenderSection
            href="/the-loai/kinh-di"
            movies={filmHorrified}
            title="Kinh Dị"
            titleClassName="bg-gradient-to-r from-yellow-400 via-white to-yellow-300"
            borderLeftColor="border-yellow-400"
          />
          {/* Scroll tới phim moi hom nay  */}
          <div ref={topRef} className="w-0 h-0" />
          {/* Phim moi hom nay  */}
          <h1 className=" text-2xl md:text-3xl font-bold text-white py-4 flex items-center gap-2 border-l-4 border-red-600 pl-4 mb-2">
            <Film className="w-8 h-8" />
            <span className="title-hover text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white/90 to-red-600">
              Phim Mới Hôm Nay
            </span>
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
                <SelectTrigger className="w-full md:w-[180px] bg-[#2a2a2a] border-[#2a2a2a] text-white">
                  <SelectValue placeholder="Danh sách" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#3a3a3a] text-white">
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
                <SelectTrigger className="w-full md:w-[180px] bg-[#2a2a2a] border-[#2a2a2a] text-white">
                  <SelectValue placeholder="Thể loại" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#3a3a3a] text-white">
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
                <SelectTrigger className="w-full md:w-[180px] bg-[#2a2a2a] border-[#2a2a2a] text-white">
                  <SelectValue placeholder="Quốc gia" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#3a3a3a] text-white">
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
                <SelectTrigger className="w-full md:w-[180px] bg-[#2a2a2a] border-[#2a2a2a] text-white">
                  <SelectValue placeholder="Năm" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#3a3a3a] text-white">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
    </HelmetSEO>
  );
};

export default FilmPage;
