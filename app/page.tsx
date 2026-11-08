import Link from "next/link";
import { connection } from "next/server";
import MeetingCard from "@/components/MeetingCard";
import { getMeetings } from "@/lib/meetings-db";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export default async function Home() {
  await connection();
  const [currentMeeting, ...recentMeetings] = getMeetings();

  return (
    <main>
      <section className="home-hero page-width">
        <div className="hero-copy">
          <p className="eyebrow">Cedar Ridge Ward · Sunday worship</p>
          <h1>A little space<br />for what matters.</h1>
          <p className="hero-description">
            Find this week’s program, get ready for Sunday, and revisit recent
            messages from our ward family.
          </p>
          <div className="hero-actions">
            <Link className="button button-dark" href={`/meetings/${currentMeeting.id}`}>
              This Sunday’s program <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/meetings">
              Browse all meetings <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="next-meeting-note">
            <span className="status-dot" aria-hidden="true" />
            <span>
              Next meeting <strong>{dateFormatter.format(new Date(`${currentMeeting.date}T12:00:00`))}</strong>
            </span>
            <span className="note-divider" aria-hidden="true" />
            <span>{currentMeeting.meetingType} meeting</span>
          </div>
        </div>
        <div className="hero-art" role="img" aria-label="Soft morning light over a quiet landscape">
          <div className="sun-disc" />
          <div className="hill hill-back" />
          <div className="hill hill-front" />
          <div className="art-caption">
            <span className="caption-mark" aria-hidden="true">✳</span>
            <span>Gather, remember, renew.</span>
          </div>
        </div>
      </section>

      <section className="home-content page-width">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The weeks behind us</p>
            <h2>Recent gatherings</h2>
          </div>
          <Link className="text-link" href="/meetings">
            View meeting archive <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="meeting-grid">
          {recentMeetings.slice(0, 3).map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      </section>

      <section className="closing-note">
        <div className="closing-note-inner page-width">
          <span className="closing-spark" aria-hidden="true">✳</span>
          <p>Come as you are. There’s a place for you here.</p>
          <span className="closing-location">CEDAR RIDGE WARD</span>
        </div>
      </section>
    </main>
  );
}
