import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="page-width mx-auto flex items-center justify-between border-b border-[var(--line)] py-4">
        <p className="eyebrow mb-0">Leader tools</p>
        <nav className="primary-nav" aria-label="Leader navigation">
          <Link className="nav-link" href="/meetings/new">
            Create meeting
          </Link>
        </nav>
      </div>
      {children}
    </>
  );
}
