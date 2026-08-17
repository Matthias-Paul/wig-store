"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex w-full items-center justify-center py-4 sm:py-5">
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className={clsx(
            "flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium transition-all sm:px-3",
            "border-gray-200 bg-white text-gray-600",
            "hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900",
            "focus:outline-none focus:ring-2 focus:ring-brand/20",
            "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white",
          )}
        >
          <ChevronLeft size={17} strokeWidth={2} />

          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Mobile page indicator */}
        <div className="flex h-10 items-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 sm:hidden">
          <span>{currentPage}</span>
          <span className="mx-1.5 text-gray-400">/</span>
          <span className="text-gray-500">{totalPages}</span>
        </div>

        {/* Desktop page numbers */}
        <div className="hidden items-center gap-1.5 sm:flex">
          {pages.map((page, i) =>
            page === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="flex h-10 w-7 items-center justify-center text-sm text-gray-400"
              >
                …
              </span>
            ) : (
              <button
                type="button"
                key={page}
                onClick={() => onPageChange(page as number)}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
                className={clsx(
                  "flex h-10 min-w-10 items-center justify-center rounded-lg px-2 text-sm font-medium transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-brand/20",
                  currentPage === page
                    ? "bg-brand text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                {page}
              </button>
            ),
          )}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className={clsx(
            "flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium transition-all sm:px-3",
            "border-gray-200 bg-white text-gray-600",
            "hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900",
            "focus:outline-none focus:ring-2 focus:ring-brand/20",
            "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white",
          )}
        >
          <span className="hidden sm:inline">Next</span>

          <ChevronRight size={17} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function getVisiblePages(current: number, total: number): (number | "...")[] {
  const delta = 1;
  const range: (number | "...")[] = [];

  const rangeStart = Math.max(2, current - delta);
  const rangeEnd = Math.min(total - 1, current + delta);

  range.push(1);

  if (rangeStart > 2) {
    range.push("...");
  }

  for (let i = rangeStart; i <= rangeEnd; i++) {
    range.push(i);
  }

  if (rangeEnd < total - 1) {
    range.push("...");
  }

  if (total > 1) {
    range.push(total);
  }

  return range;
}
