import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import MeetingDetail from "@/components/MeetingDetail";
import { getMeetingById } from "@/lib/meetings-db";

type MeetingPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: MeetingPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `${id} Meeting Program`,
  };
}

export default async function MeetingPage({ params }: MeetingPageProps) {
  await connection();
  const { id } = await params;
  const meeting = getMeetingById(id);

  if (!meeting) {
    notFound();
  }

  return (
    <main className="page-main">
      <MeetingDetail meeting={meeting} />
    </main>
  );
}
