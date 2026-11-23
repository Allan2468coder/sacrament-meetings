"use client";

import MeetingRouteError from "@/components/MeetingRouteError";

export default function AdminMeetingsError({
  error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  return <MeetingRouteError error={error} reset={reset} />;
}
