"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function MeetingRouteError({
  error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Meeting route error:", error);
  }, [error]);

  return (
    <main className="page-main page-width">
      <section className="form-section" aria-labelledby="meeting-error-title">
        <p className="eyebrow">Meeting programs</p>
        <h1 id="meeting-error-title">Something went wrong</h1>
        <p>
          We couldn’t load or save this meeting. Please try again.
        </p>
        <div className="hero-actions">
          <button className="button button-dark" onClick={reset} type="button">
            Try Again
          </button>
          <Link className="button button-light" href="/meetings">
            Back to meetings
          </Link>
        </div>
      </section>
    </main>
  );
}
