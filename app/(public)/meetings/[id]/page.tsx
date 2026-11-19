import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import MeetingDetail from "@/components/MeetingDetail";
import { fetchMeetingsApi } from "@/lib/meetings-api";
import type { SacramentMeeting } from "@/lib/types";

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

function MeetingLoading() {
  return (
    <div className="page-main page-width" aria-busy="true">
      <p className="eyebrow" role="status">Loading meeting program…</p>
    </div>
  );
}

async function MeetingPageContent({ params }: MeetingPageProps) {
  await connection();
  const { id } = await params;
  const response = await fetchMeetingsApi(`/api/meetings/${encodeURIComponent(id)}`);

  if (response.status === 400 || response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Unable to load meeting: ${response.status} ${response.statusText}`);
  }

  const meeting: SacramentMeeting = await response.json();

  return (
    <main className="page-main">
      <MeetingDetail meeting={meeting} />
    </main>
  );
}

export default function MeetingPage({ params }: MeetingPageProps) {
  return (
    <Suspense fallback={<MeetingLoading />}>
      <MeetingPageContent params={params} />
    </Suspense>
  );
}
