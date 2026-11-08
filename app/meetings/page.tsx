import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import MeetingCard from "@/components/MeetingCard";
import { fetchMeetingsApi } from "@/lib/meetings-api";
import type { SacramentMeeting } from "@/lib/types";

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

async function MeetingArchive() {
  await connection();
  const response = await fetchMeetingsApi("/api/meetings");

  if (!response.ok) {
    throw new Error(`Unable to load meetings: ${response.status} ${response.statusText}`);
  }

  const meetings: SacramentMeeting[] = await response.json();

  return (
    <main className="page-main">
      <div className="page-width">
        <header className="page-heading">
          <div>
            <p className="eyebrow">Cedar Ridge Ward</p>
            <h1>Meetings, remembered.</h1>
            <p>Programs from recent Sundays, gathered in one place.</p>
          </div>
          <span className="archive-count">{meetings.length} recent Sundays</span>
        </header>
        <h2 className="sr-only">Recent meeting programs</h2>
        <div className="archive-list">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function MeetingsPage() {
  return (
    <Suspense fallback={<MeetingsLoading />}>
      <MeetingArchive />
    </Suspense>
  );
}
