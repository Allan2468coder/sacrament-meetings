import { Suspense } from "react";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="page-width mx-auto flex items-center justify-between border-b border-[var(--line)] py-4">
        <p className="eyebrow mb-0">Meeting programs</p>
        <Suspense
          fallback={
            <nav className="primary-nav" aria-label="Meetings navigation">
              <Link className="nav-link" href="/meetings">All meetings</Link>
              <Link className="nav-link" href="/meetings/current">This Sunday</Link>
            </nav>
          }
        >
          <NavLinks variant="meetings" />
        </Suspense>
      </div>
      {children}
    </>
  );
}
