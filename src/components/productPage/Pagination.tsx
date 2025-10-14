"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export default function PaginationControl({
  currentPage,
  totalPages,
  setPage,
}: PaginationControlProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="w-full flex justify-center mt-6">
      <div className="inline-flex">
        <Pagination className="text-base">
          <PaginationContent className="gap-2">
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  className="px-8 py-6 text-lg rounded border"
                  onClick={() => currentPage > 1 && setPage(currentPage - 1)}
                />
              </PaginationItem>
            )}

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => setPage(page)}
                    className={`px-8 py-6 text-lg rounded border ${
                      page === currentPage
                        ? "bg-primary text-white"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  className="px-8 py-6 text-lg rounded border"
                  onClick={() => setPage(currentPage + 1)}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
