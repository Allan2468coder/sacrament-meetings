import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUpcomingMeeting } from "@/lib/meetings-db";

export const metadata: Metadata = {
  title: "This Sunday",
  description: "Find the upcoming Cedar Ridge Ward sacrament meeting program.",
};

function CurrentMeetingLoading() {
  return (
    <div className="page-main page-width" aria-busy="true">
      <p className="eyebrow" role="status">Finding this Sunday’s meeting…</p>
    </div>
  );
}

async function RedirectToUpcomingMeeting() {
  await connection();
  const meeting = await getUpcomingMeeting();

  if (!meeting) {
    return (
      <main className="page-main page-width">
        <h1>No upcoming meeting program</h1>
        <p>There isn’t a future meeting program available yet.</p>
        <Link className="text-link" href="/meetings">
          Browse recent meetings <span aria-hidden="true">→</span>
        </Link>
      </main>
    );
  }

  redirect(`/meetings/${meeting.id}`);
}

export default function CurrentMeetingPage() {
  return (
    <Suspense fallback={<CurrentMeetingLoading />}>
      <RedirectToUpcomingMeeting />
    </Suspense>
  );
}
