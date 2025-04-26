import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import PullToRefresh from "@/components/custom/pull_to_refresh";
import { GetFilmsType, Movie } from "@/apis/index.d";
import ListView from "@/components/list";
import MovieCard from "@/components/custom/movie_card";
import filmApi from "@/apis/film.api";
import Pagination from "@/components/custom/pagination";

const FilmSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const keyword = searchParams.get("keyword") || "";
    const page = parseInt(searchParams.get("page") || "1");

    if (keyword) {
      setSearchInput(keyword);
      setCurrentPage(page);
      fetchSearchResults(keyword, page);
    }
  }, []);

  const fetchSearchResults = async (keyword: string, page: number) => {
    setIsLoading(true);
    try {
      const response = await filmApi.getFilmsBy({
        type: GetFilmsType.KEYWORD,
        value: encodeURIComponent(keyword),
        page,
      });
      if (response.status === "success") {
        setMovies(response.data.items);
        setTotalPages(response.data.params.pagination.totalPages);
        setCurrentPage(response.data.params.pagination.currentPage);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ keyword: searchInput, page: "1" });
      fetchSearchResults(searchInput, 1);
    }
  };

  const handlePagination = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ keyword: searchInput, page: page.toString() });
    fetchSearchResults(searchInput, page);
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(10)].map((_, index) => (
        <Card
          key={index}
          className="bg-[#0a0a0a] border-none"
          data-aos="fade-up"
          data-aos-delay={index * 50}
        >
          <CardContent className="p-0">
            <div className="relative">
              <Skeleton className="w-full h-80 bg-[#1a1a1a]" />
              <Skeleton className="absolute top-2 right-2 w-12 h-6 bg-[#1a1a1a] rounded" />
              <Skeleton className="absolute bottom-2 left-2 w-12 h-6 bg-[#1a1a1a] rounded" />
            </div>
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 bg-[#1a1a1a] rounded mb-2" />
              <Skeleton className="h-4 w-1/2 bg-[#1a1a1a] rounded mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 bg-[#1a1a1a] rounded-full" />
                <Skeleton className="h-6 w-16 bg-[#1a1a1a] rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [movies]);
  const renderMovies = () => {
    if (movies.length === 0) {
      return (
        <div className="col-span-full text-center py-8" data-aos="fade-up">
          <p className="text-gray-400">Không tìm thấy phim nào phù hợp</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ListView
          data={movies}
          render={(movie, index) => (
            <MovieCard key={movie.slug} movie={movie} index={index} />
          )}
        />
      </div>
    );
  };

  return (
    <section className="bg-[#0a0a0a] h-full">
      <PullToRefresh />
      <div ref={topRef} className="w-0 h-0" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8" data-aos="fade-down">
          <form
            onSubmit={handleSearch}
            className="flex gap-2 max-w-2xl mx-auto"
          >
            <Input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 bg-[#1a1a1a] text-white placeholder-gray-400 border-none focus-visible:ring-red-600"
              placeholder="Tìm kiếm phim..."
            />
            <Button type="submit" variant="destructive" className="px-4 py-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Button>
          </form>
        </div>

        <div id="searchResults">
          {isLoading ? renderSkeleton() : renderMovies()}
          {!isLoading && movies.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              loadMovies={handlePagination}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default FilmSearchPage;
