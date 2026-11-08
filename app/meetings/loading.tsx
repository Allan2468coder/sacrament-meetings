export default function Loading() {
  return (
    <main className="loading-page page-width" aria-label="Loading meetings">
      <div className="skeleton skeleton-title" />
      <div className="meeting-grid">
        <div className="skeleton skeleton-card" />
        <div className="skeleton skeleton-card" />
        <div className="skeleton skeleton-card" />
      </div>
    </main>
  );
}
