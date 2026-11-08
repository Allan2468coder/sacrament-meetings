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
        <NavLinks variant="meetings" />
      </div>
      {children}
    </>
  );
}
