import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Leader Dashboard",
  description: "Manage Cedar Ridge Ward sacrament meeting programs.",
};

export default function DashboardPage() {
  return (
    <main className="page-main page-width">
      <Suspense fallback={<p role="status">Loading dashboard…</p>}>
        <DashboardGreeting />
      </Suspense>
    </main>
  );
}

async function DashboardGreeting() {
  const session = await auth();
  const user = session?.user;

  return <p>Welcome, {user?.name}!</p>;
}
