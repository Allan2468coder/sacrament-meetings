import Link from "next/link";
import type { SacramentMeeting } from "@/lib/types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export default function MeetingCard({ meeting }: { meeting: SacramentMeeting }) {
  const meetingType = meeting.meetingType.charAt(0).toUpperCase() + meeting.meetingType.slice(1);

  return (
    <Link
      className="meeting-card"
      href={`/meetings/${meeting.id}`}
      aria-label={`View ${meetingType.toLowerCase()} meeting program for ${dateFormatter.format(new Date(`${meeting.date}T12:00:00`))}`}
    >
      <div className="card-topline">
        <span className="card-label">{meetingType} meeting</span>
        <span>{dateFormatter.format(new Date(`${meeting.date}T12:00:00`))}</span>
      </div>
      <div>
        <h3>{meetingType} meeting</h3>
        <p className="card-subtitle">
          {meeting.speakers.map((speaker) => speaker.name.replace(/^(Sister|Brother) /, "")).join(" · ")}
        </p>
      </div>
      <div className="card-bottomline">
        <span>Presiding: {meeting.presiding}</span>
        <span className="card-arrow" aria-hidden="true">↗</span>
      </div>
    </Link>
  );
}
