"use client";

export default function PrintButton() {
  return (
    <button className="button button-light" onClick={() => window.print()} type="button">
      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 20 20" fill="none">
        <path d="M6 6V3.5h8V6m-8 8H4.5A1.5 1.5 0 0 1 3 12.5v-4A1.5 1.5 0 0 1 4.5 7h11A1.5 1.5 0 0 1 17 8.5v4a1.5 1.5 0 0 1-1.5 1.5H14m-8-3h8v6H6v-6Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <circle cx="14.5" cy="9.5" r=".7" fill="currentColor" />
      </svg>
      Print program
    </button>
  );
}
