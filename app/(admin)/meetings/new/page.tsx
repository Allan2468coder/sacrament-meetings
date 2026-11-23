import { createMeeting } from "@/lib/actions";
import MeetingForm from "../MeetingForm";

export default function NewMeetingPage() {
  return (
    <main className="page-main page-width">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Leader tools</p>
          <h1>Create a meeting</h1>
          <p>Prepare the program for an upcoming sacrament meeting.</p>
        </div>
      </header>
      <MeetingForm
        action={createMeeting}
        submitLabel="Create meeting"
      />
    </main>
  );
}
