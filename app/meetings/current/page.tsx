import { Suspense } from "react";
import { connection } from "next/server";
import MeetingDetail from "@/components/MeetingDetail";
import { getUpcomingMeeting } from "@/lib/meetings-db";

function CurrentMeetingLoading() {
  return (
    <div className="page-main page-width" aria-busy="true">
      <p className="eyebrow" role="status">Finding this Sunday’s meeting…</p>
    </div>
  );
}

async function UpcomingMeeting() {
  await connection();
  return (
    <main className="page-main">
      <MeetingDetail meeting={getUpcomingMeeting()} />
    </main>
  );
}

export default function CurrentMeetingPage() {
  return (
    <Suspense fallback={<CurrentMeetingLoading />}>
      <UpcomingMeeting />
    </Suspense>
  );
}
