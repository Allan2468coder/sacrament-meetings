import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getMeetings } from "@/lib/meetings-db";

export default async function CurrentMeetingPage() {
  await connection();
  const [currentMeeting] = getMeetings();
  redirect(`/meetings/${currentMeeting.id}`);
}
