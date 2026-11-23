import Link from "next/link";

export default function MeetingEditNotFound() {
  return (
    <main className="page-main page-width">
      <section className="form-section" aria-labelledby="meeting-not-found-title">
        <p className="eyebrow">Leader tools</p>
        <h1 id="meeting-not-found-title">Meeting not found</h1>
        <p>The meeting program you requested doesn’t exist.</p>
        <Link className="button button-light" href="/meetings">
          Back to meetings
        </Link>
      </section>
    </main>
  );
}
