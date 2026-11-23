import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { getMeetings, getMeetingsTotalPages } from "@/lib/meetings-db";
import { MeetingSearch } from "@/components/MeetingSearch";
import MeetingCard from "@/components/MeetingCard";
import Pagination from "@/components/Pagination";

export const metadata: Metadata = {
  title: "Meetings",
  description: "Explore recent sacrament meeting programs from the Cedar Ridge Ward.",
};

function MeetingsLoading() {
  return (
    <div className="page-main page-width" aria-busy="true">
      <p className="eyebrow" role="status">Loading meetings…</p>
    </div>
  );
}

type MeetingsPageProps = {
  searchParams: Promise<{
    query?: string | string[];
    page?: string | string[];
  }>;
};

async function MeetingArchive({ searchParams }: MeetingsPageProps) {
  await connection();
  const params = await searchParams;
  const queryParam = params.query;
  const query = Array.isArray(queryParam)
    ? queryParam[0] ?? ""
    : queryParam ?? "";
  const pageParam = Array.isArray(params.page)
    ? params.page[0]
    : params.page;
  const parsedPage = Number(pageParam);
  const requestedPage =
    Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const totalPages = await getMeetingsTotalPages(query);
  const currentPage = Math.min(requestedPage, Math.max(totalPages, 1));
  const meetings = await getMeetings(query, currentPage);

  return (
    <main className="page-main">
      <div className="page-width">
        <header className="page-heading">
          <div>
            <p className="eyebrow">Cedar Ridge Ward</p>
            <h1>Meetings, remembered.</h1>
            <p>Programs from recent Sundays, gathered in one place.</p>
          </div>
          <span className="archive-count">
            {totalPages > 0
              ? `Page ${currentPage} of ${totalPages}`
              : "No meetings"}
          </span>
        </header>
        <div className="archive-controls">
          <Suspense fallback={null}>
            <MeetingSearch />
          </Suspense>
        </div>
        <h2 className="sr-only">Recent meeting programs</h2>
        {meetings.length > 0 ? (
          <div className="archive-list">
            {meetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} showDelete />
            ))}
          </div>
        ) : (
          <p className="archive-empty" role="status">
            {query
              ? `No meetings match “${query}”.`
              : "No meetings are available yet."}
          </p>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          query={query}
        />
      </div>
    </main>
  );
}

export default function MeetingsPage({ searchParams }: MeetingsPageProps) {
  return (
    <Suspense fallback={<MeetingsLoading />}>
      <MeetingArchive searchParams={searchParams} />
    </Suspense>
  );
}
