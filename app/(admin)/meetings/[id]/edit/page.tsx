import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DeleteMeetingForm from "@/components/DeleteMeetingForm";
import MeetingForm from "../../MeetingForm";
import { updateMeeting } from "@/lib/actions";
import { getMeetingById } from "@/lib/meetings-db";

export const metadata: Metadata = {
  title: "Edit Meeting",
  description: "Edit a Cedar Ridge Ward sacrament meeting program.",
};

async function EditMeetingPageContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!id.trim() || !Number.isSafeInteger(numericId) || numericId < 1) {
    notFound();
  }

  const meeting = await getMeetingById(numericId);
  if (!meeting) {
    notFound();
  }

  const updateMeetingForId = updateMeeting.bind(null, numericId);

  return (
    <main className="page-main page-width">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Leader tools · Program {meeting.id}</p>
          <h1>Edit meeting</h1>
          <p>Update the details and order of this meeting program.</p>
        </div>
      </header>
      <MeetingForm
        action={updateMeetingForId}
        meeting={meeting}
        submitLabel="Save changes"
      />
      <section className="danger-zone" aria-labelledby="delete-meeting-heading">
        <div>
          <h2 id="delete-meeting-heading">Delete this program</h2>
          <p>This permanently removes the meeting and its program.</p>
        </div>
        <DeleteMeetingForm id={meeting.id} />
      </section>
    </main>
  );
}

export default function EditMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="page-main page-width" aria-busy="true">
          <p className="eyebrow" role="status">
            Loading meeting…
          </p>
        </main>
      }
    >
      <EditMeetingPageContent params={params} />
    </Suspense>
  );
}
