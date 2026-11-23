"use client";

import MeetingRouteError from "@/components/MeetingRouteError";

export default function PublicMeetingsError({
  error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  return <MeetingRouteError error={error} reset={reset} />;
}
