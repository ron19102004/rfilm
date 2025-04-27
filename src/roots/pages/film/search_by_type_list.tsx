import filmApi from "@/apis/film.api";
import { GetFilmsType, Movie } from "@/apis/index.d";
import { transFilmTypeToVN } from "@/apis/trans.f";
import Loading from "@/components/custom/loading";
import MovieCard from "@/components/custom/movie_card";
import Pagination from "@/components/custom/pagination";
import PullToRefresh from "@/components/custom/pull_to_refresh";
import ListView from "@/components/list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSystemContext } from "@/context";
import MainBackMobile from "@/roots/layouts/partials/main_back_mobile";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const TypeListPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  const selectedGenreRef = useRef<string>(selectedGenre);
  const selectedCountryRef = useRef<string>(selectedCountry);
  const selectedYearRef = useRef<string>(selectedYear);

  const {
    isLoading: isLoadingSystem,
    countries,
    genres,
    scrollToTop,
  } = useSystemContext();
  useEffect(() => {
    scrollToTop();
  }, [movies]);
  // Search movies
  const searchMovies = async () => {
    if (loading || !slug) return;
    setLoading(true);
    try {
      const response = await filmApi.getFilmsBy({
        type: GetFilmsType.LIST,
        value: slug.toString(),
        page: currentPage,
        selectedCountry: selectedCountryRef.current,
        selectedGenre: selectedGenreRef.current,
        selectedYear: selectedYearRef.current,
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
    searchMovies();
  }, [slug, selectedGenre, selectedCountry, selectedYear, currentPage]);
  return (
    <div className="bg-[#1a1a1a] pt-20">
      <MainBackMobile title={transFilmTypeToVN(slug?.toString() || "") || ""} />
      <PullToRefresh
        onRefresh={async () => {
          window.location.reload();
        }}
      />
      {/* Loading Overlay */}
      {loading ? <Loading /> : isLoadingSystem ? <Loading /> : null}

      <main className=" px-4">
        {/* Filter Section */}
        <div
          className="mb-8 grid grid-cols-2 md:flex md:flex-row gap-4"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Thể loại</label>
            <Select
              value={selectedGenre}
              onValueChange={(value: string) => {
                setSelectedGenre(value);
                selectedGenreRef.current = value;
              }}
            >
              <SelectTrigger className="w-full md:w-[180px] bg-[#2a2a2a] border-[#3a3a3a] text-white">
                <SelectValue placeholder="Thể loại" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a] text-white">
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
                selectedCountryRef.current = value;
              }}
            >
              <SelectTrigger className="w-full md:w-[180px] bg-[#2a2a2a] border-[#3a3a3a] text-white">
                <SelectValue placeholder="Quốc gia" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a] text-white">
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
                selectedYearRef.current = value;
              }}
            >
              <SelectTrigger className="w-full md:w-[180px] bg-[#2a2a2a] border-[#3a3a3a] text-white">
                <SelectValue placeholder="Năm" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a] text-white">
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
            <div className="col-span-full text-center py-8" data-aos="fade-up">
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
            setCurrentPage(page);
          }}
        />
      </main>
    </div>
  );
};

export default TypeListPage;
