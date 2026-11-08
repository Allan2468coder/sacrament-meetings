"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();
  const onMeetingsPage = pathname.startsWith("/meetings");

  return (
    <nav className="primary-nav" aria-label="Main navigation">
      <Link
        className="nav-link"
        href="/"
        aria-current={pathname === "/" ? "page" : undefined}
      >
        Overview
      </Link>
      <Link
        className="nav-link"
        href="/meetings"
        aria-current={onMeetingsPage ? "page" : undefined}
      >
        Meetings
      </Link>
    </nav>
  );
}
