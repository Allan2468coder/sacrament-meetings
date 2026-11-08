"use client";

import { useSyncExternalStore } from "react";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export default function CurrentDate() {
  const date = useSyncExternalStore(
    (onStoreChange) => {
      const interval = window.setInterval(onStoreChange, 60_000);
      return () => window.clearInterval(interval);
    },
    () => dateFormatter.format(new Date()),
    () => "Today",
  );

  return <span className="header-date">{date}</span>;
}
