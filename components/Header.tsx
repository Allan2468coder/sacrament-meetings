import { Suspense } from "react";
import Link from "next/link";
import CurrentDate from "@/components/CurrentDate";
import NavLinks from "@/components/NavLinks";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Cedar Ridge Ward home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3.5v17M7.5 8h9M5 20.5h14M7.5 20.5v-6a4.5 4.5 0 0 1 9 0v6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
          </span>
          <span className="brand-copy">
            <span className="brand-name">Cedar Ridge</span>
            <span className="brand-subtitle">A place to gather</span>
          </span>
        </Link>
        <div className="header-right">
          <CurrentDate />
          <Suspense
            fallback={
              <nav className="primary-nav" aria-label="Main navigation">
                <Link className="nav-link" href="/">Overview</Link>
                <Link className="nav-link" href="/meetings">Meetings</Link>
              </nav>
            }
          >
            <NavLinks />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
