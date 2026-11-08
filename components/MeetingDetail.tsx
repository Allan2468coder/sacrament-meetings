import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import type { SacramentMeeting } from "@/lib/types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

export default function MeetingDetail({ meeting }: { meeting: SacramentMeeting }) {
  const date = dateFormatter.format(new Date(`${meeting.date}T12:00:00`));
  const program = [
    { label: "Prelude music", detail: "Quiet music by the ward organist" },
    { label: "Opening hymn", detail: meeting.openingHymn.title, secondary: `Hymn ${meeting.openingHymn.number}` },
    { label: "Opening prayer", detail: meeting.openingPrayer },
    ...(meeting.announcements ?? []).map((announcement) => ({
      label: "Announcement",
      detail: announcement,
    })),
    ...meeting.wardBusiness.map((item) => ({
      label: "Ward business",
      detail: item.description,
    })),
    ...(meeting.stakeBusiness
      ? [{ label: "Stake business", detail: "Stake announcements and business" }]
      : []),
    { label: "Sacrament hymn", detail: meeting.sacramentHymn.title, secondary: `Hymn ${meeting.sacramentHymn.number}` },
    { label: "Administration of the sacrament", detail: "A time to remember the Savior" },
    ...meeting.speakers.map((speaker) => ({
      label: speaker.type === "speaker" ? "Message" : "Musical number",
      detail: speaker.name,
      secondary: speaker.topic,
    })),
    { label: "Closing hymn", detail: meeting.closingHymn.title, secondary: `Hymn ${meeting.closingHymn.number}` },
    { label: "Closing prayer", detail: meeting.closingPrayer },
  ];

  return (
    <article className="meeting-detail">
      <Link className="detail-back" href="/meetings">
        <span aria-hidden="true">←</span> All meetings
      </Link>

      <div className="detail-banner">
        <div className="detail-banner-copy meeting-detail-heading">
          <p className="eyebrow">Cedar Ridge Ward · {meeting.meetingType} meeting</p>
          <h1>Sacrament meeting</h1>
          <p className="detail-date">{date}</p>
        </div>
        <div className="detail-banner-note">
          {meeting.meetingType.charAt(0).toUpperCase() + meeting.meetingType.slice(1)} meeting
        </div>
      </div>

      <div className="detail-toolbar">
        <PrintButton />
      </div>

      <div className="program-layout">
        <section className="program-panel" aria-labelledby="program-title">
          <div className="panel-heading">
            <h2 id="program-title">Order of meeting</h2>
            <span>{date}</span>
          </div>
          <ol className="program-list">
            {program.map((item, index) => (
              <li className="program-row" key={`${item.label}-${index}`}>
                <span className="program-number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className="program-label">{item.label}</p>
                  <p className="program-detail">{item.detail}</p>
                  {item.secondary && <p className="program-detail program-secondary">{item.secondary}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <aside className="detail-sidebar" aria-label="Meeting details">
          <section className="detail-sidebar-card">
            <h2>Today’s gathering</h2>
            <div className="sidebar-group">
              <p className="sidebar-label">Presiding</p>
              <p className="sidebar-value">{meeting.presiding}</p>
            </div>
            <div className="sidebar-group">
              <p className="sidebar-label">Conducting</p>
              <p className="sidebar-value">{meeting.conducting}</p>
            </div>
          </section>

          <section className="detail-sidebar-card">
            <h2>Hymns</h2>
            {[
              { label: "Opening", hymn: meeting.openingHymn },
              { label: "Sacrament", hymn: meeting.sacramentHymn },
              { label: "Closing", hymn: meeting.closingHymn },
            ].map(({ label, hymn }) => (
              <div className="sidebar-group" key={label}>
                <p className="sidebar-label">{label} hymn · {hymn.number}</p>
                <p className="sidebar-value">{hymn.title}</p>
              </div>
            ))}
          </section>
        </aside>
      </div>

      <Link className="back-to-archive" href="/meetings">
        Return to all meetings <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
