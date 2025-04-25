import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface Movie {
  name: string;
  origin_name: string;
  poster_url: string;
  quality: string;
  episode_current: string;
  year: string;
  time: string;
  lang: string;
  slug: string;
  category: Array<{ name: string }>;
  country: Array<{ name: string }>;
}

interface SearchResponse {
  status: string;
  data: {
    items: Movie[];
    APP_DOMAIN_CDN_IMAGE: string;
    params: {
      pagination: {
        totalPages: number;
        currentPage: number;
      };
    };
  };
}

const FilmSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [domain, setDomain] = useState("");
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
      const response = await fetch(
        `https://phimapi.com/v1/api/tim-kiem?keyword=${encodeURIComponent(
          keyword
        )}&page=${page}`
      );
      const data: SearchResponse = await response.json();

      if (data.status === "success") {
        setMovies(data.data.items);
        setDomain(data.data.APP_DOMAIN_CDN_IMAGE);
        setTotalPages(data.data.params.pagination.totalPages);
        setCurrentPage(data.data.params.pagination.currentPage);
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
        <Card key={index} className="bg-[#0a0a0a] border-none">
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
        <div className="col-span-full text-center py-8">
          <p className="text-gray-400">Không tìm thấy phim nào phù hợp</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Card
            key={movie.slug}
            className="bg-[#1a1a1a] border-[#2a2a2a] border-none hover:shadow-lg transition-all duration-300 py-0"
          >
            <CardContent className="p-0">
              <div className="relative group">
                <img
                  src={`${domain}/${movie.poster_url}`}
                  alt={movie.name}
                  className="w-full h-80 object-cover group-hover:opacity-80 transition-opacity duration-300"
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {movie.quality}
                </div>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {movie.episode_current}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button variant="destructive" className="px-6 py-3" asChild>
                    <Link to={`/xem-phim/${movie.slug}`}>
                      <i className="fas fa-play mr-2"></i>Xem ngay
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="p-4">
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
                  {movie.category.map((cat, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#1a1a1a] text-gray-300 rounded-full text-xs"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {movie.country.map((country, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#1a1a1a] text-gray-300 rounded-full text-xs"
                    >
                      {country.name}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    const maxVisiblePages = 5;
    const pages = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at the start
      if (currentPage <= 2) {
        end = 4;
      }
      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      // Add ellipsis and middle pages
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) pages.push("...");

      // Always show last page
      pages.push(totalPages);
    }

    return (
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-2">
          {currentPage > 1 && (
            <Button
              variant="outline"
              onClick={() => handlePagination(currentPage - 1)}
              className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] border-none"
            >
              Previous
            </Button>
          )}
          {pages.map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="px-4 text-gray-400">
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? "destructive" : "outline"}
                onClick={() => handlePagination(page as number)}
                className={
                  page === currentPage
                    ? ""
                    : "bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] border-none"
                }
              >
                {page}
              </Button>
            )
          )}
          {currentPage < totalPages && (
            <Button
              variant="outline"
              onClick={() => handlePagination(currentPage + 1)}
              className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] border-none"
            >
              Next
            </Button>
          )}
        </nav>
      </div>
    );
  };

  return (
    <section className="bg-[#0a0a0a] h-full">
      <div ref={topRef} className="w-0 h-0" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
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
          {!isLoading && movies.length > 0 && renderPagination()}
        </div>
      </div>
    </section>
  );
};

export default FilmSearchPage;
