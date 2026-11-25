"use client";

import { useSession } from "next-auth/react";

export function UserGreeting() {
  const { data: session } = useSession();

  return <span>{session?.user?.name}</span>;
}
