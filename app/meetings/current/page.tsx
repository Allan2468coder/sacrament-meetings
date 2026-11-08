import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getCurrentSundayDate, getMeetings } from "@/lib/meetings-db";

function CurrentMeetingLoading() {
  return (
    <div className="page-main page-width" aria-busy="true">
      <p className="eyebrow" role="status">Finding this Sunday’s meeting…</p>
    </div>
  );
}

async function RedirectToCurrentMeeting(): Promise<never> {
  await connection();
  const [currentMeeting] = getMeetings(getCurrentSundayDate());

  if (!currentMeeting) {
    redirect("/meetings");
  }

  redirect(`/meetings/${currentMeeting.id}`);
}

export default function CurrentMeetingPage() {
  return (
    <Suspense fallback={<CurrentMeetingLoading />}>
      <RedirectToCurrentMeeting />
    </Suspense>
  );
}
