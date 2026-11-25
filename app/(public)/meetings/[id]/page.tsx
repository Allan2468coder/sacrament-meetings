import { cache, Suspense } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import MeetingDetail from "@/components/MeetingDetail";
import { fetchMeetingsApi } from "@/lib/meetings-api";
import type { SacramentMeeting } from "@/lib/types";

type MeetingPageProps = {
  params: Promise<{ id: string }>;
};

const getMeeting = cache(async (id: string): Promise<SacramentMeeting | null> => {
  const response = await fetchMeetingsApi(
    `/api/meetings/${encodeURIComponent(id)}`,
  );

  if (response.status === 400 || response.status === 404) return null;

  if (!response.ok) {
    throw new Error(
      `Unable to load meeting: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<SacramentMeeting>;
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

export async function generateMetadata({
  params,
}: MeetingPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { id } = await params;
  const [meeting, parentMetadata] = await Promise.all([getMeeting(id), parent]);

  if (!meeting) {
    return {
      title: "Meeting Not Found",
      description:
        "The requested Cedar Ridge Ward meeting program could not be found.",
    };
  }

  const date = dateFormatter.format(new Date(`${meeting.date}T12:00:00`));
  const meetingType =
    meeting.meetingType.charAt(0).toUpperCase() + meeting.meetingType.slice(1);
  const title = `${date} Meeting Program`;
  const description = `${meetingType} sacrament meeting program for Cedar Ridge Ward on ${date}. Presiding: ${meeting.presiding}. View hymns, prayers, announcements, and speakers.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: parentMetadata.openGraph?.images ?? [],
    },
    twitter: {
      title,
      description,
      images: parentMetadata.twitter?.images ?? [],
    },
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
  const meeting = await getMeeting(id);

  if (!meeting) notFound();

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
