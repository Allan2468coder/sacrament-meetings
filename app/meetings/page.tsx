import type { Metadata } from "next";
import { connection } from "next/server";
import MeetingCard from "@/components/MeetingCard";
import { getMeetings } from "@/lib/meetings-db";

export const metadata: Metadata = {
  title: "Meetings",
  description: "Explore recent sacrament meeting programs from the Cedar Ridge Ward.",
};

export default async function MeetingsPage() {
  await connection();
  const meetings = getMeetings();

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
        <div className="archive-list">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      </div>
    </main>
  );
}
