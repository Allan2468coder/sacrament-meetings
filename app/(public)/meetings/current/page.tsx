import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { getUpcomingMeeting } from "@/lib/meetings-db";

export default async function CurrentMeetingPage() {
  await connection();
  const meeting = await getUpcomingMeeting();

  if (!meeting) {
    notFound();
  }

  redirect(`/meetings/${meeting.id}`);
}
