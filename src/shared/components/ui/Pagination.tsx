import React from "react";

interface PaginationProps {
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  total,
  pageSize,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));

  const createPageRange = () => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md border ${
          currentPage === 1
            ? "text-neutral-400 border-neutral-200"
            : "text-neutral-700 border-neutral-300 hover:bg-neutral-50"
        }`}
      >
        Anterior
      </button>

      <div className="hidden sm:flex items-center gap-2">
        {createPageRange().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage}
            className={`px-3 py-1 rounded-md border ${
              p === currentPage
                ? "bg-primary-600 text-white border-primary-600"
                : "text-neutral-700 border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md border ${
          currentPage === totalPages
            ? "text-neutral-400 border-neutral-200"
            : "text-neutral-700 border-neutral-300 hover:bg-neutral-50"
        }`}
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
