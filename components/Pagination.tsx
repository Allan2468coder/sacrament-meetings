import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  query: string;
};

function getPageHref(page: number, query: string): string {
  const params = new URLSearchParams();
  if (query) {
    params.set("query", query);
  }
  params.set("page", String(page));
  return `/meetings?${params.toString()}`;
}

export default function Pagination({
  currentPage,
  totalPages,
  query,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="mt-7 flex items-center justify-center gap-4"
      aria-label="Meeting archive pages"
    >
      {currentPage > 1 ? (
        <Link
          className="inline-flex min-h-10 items-center justify-center rounded-sm border border-[var(--line)] bg-white px-4 text-xs font-medium text-[var(--green-dark)] transition-colors hover:border-[var(--green)] hover:bg-[#f1f1e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green)]"
          href={getPageHref(currentPage - 1, query)}
          rel="prev"
        >
          Previous
        </Link>
      ) : (
        <span
          className="inline-flex min-h-10 cursor-not-allowed items-center justify-center rounded-sm border border-[var(--line)] bg-white px-4 text-xs font-medium text-[var(--muted)] opacity-50"
          aria-disabled="true"
        >
          Previous
        </span>
      )}
      <span
        className="min-w-24 text-center text-xs text-[var(--muted)]"
        aria-current="page"
      >
        Page <span className="font-semibold text-[var(--ink)]">{currentPage}</span>{" "}
        of {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link
          className="inline-flex min-h-10 items-center justify-center rounded-sm border border-[var(--line)] bg-white px-4 text-xs font-medium text-[var(--green-dark)] transition-colors hover:border-[var(--green)] hover:bg-[#f1f1e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green)]"
          href={getPageHref(currentPage + 1, query)}
          rel="next"
        >
          Next
        </Link>
      ) : (
        <span
          className="inline-flex min-h-10 cursor-not-allowed items-center justify-center rounded-sm border border-[var(--line)] bg-white px-4 text-xs font-medium text-[var(--muted)] opacity-50"
          aria-disabled="true"
        >
          Next
        </span>
      )}
    </nav>
  );
}
