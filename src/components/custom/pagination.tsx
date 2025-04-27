import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ListView from "@/components/list";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  loadMovies: (page: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  loadMovies,
}) => {
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
        className="h-8 w-8 cursor-pointer"
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
          className="h-8 w-8 cursor-pointer"
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
          variant={i === currentPage ? "destructive" : "outline"}
          size="sm"
          className="h-8 w-8 cursor-pointer"
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
          className="h-8 w-8 cursor-pointer"
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
        className="h-8 w-8 cursor-pointer"
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );

    return pages;
  };
  return (
    <div
      className="mt-8 flex justify-center"
      data-aos="fade-up"
      data-aos-delay="200"
    >
      <div className="flex items-center gap-1">
        <ListView
          data={renderPagination()}
          render={(page, index) => <div key={index}>{page}</div>}
        />
      </div>
    </div>
  );
};

export default Pagination;
