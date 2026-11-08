"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinksProps = {
  variant?: "primary" | "meetings";
};

export default function NavLinks({ variant = "primary" }: NavLinksProps) {
  const pathname = usePathname();
  const onMeetingsPage = pathname.startsWith("/meetings");

  if (variant === "meetings") {
    return (
      <nav className="primary-nav" aria-label="Meetings navigation">
        <Link
          className="nav-link"
          href="/meetings"
          aria-current={pathname === "/meetings" ? "page" : undefined}
        >
          All meetings
        </Link>
        <Link
          className="nav-link"
          href="/meetings/current"
          aria-current={pathname === "/meetings/current" ? "page" : undefined}
        >
          This Sunday
        </Link>
      </nav>
    );
  }

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
