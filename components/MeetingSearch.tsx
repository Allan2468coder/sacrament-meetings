"use client";

import { useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function MeetingSearch() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const pathname = usePathname();
  const { push } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== query) {
      inputRef.current.value = query;
    }
  }, [query]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const query = term.trim();

    params.set("page", "1");
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }

    const queryString = params.toString();
    push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }, 300);

  return (
    <div className="meeting-search">
      <input
        ref={inputRef}
        type="search"
        placeholder="Search by speaker, leader, or meeting type..."
        defaultValue={query}
        onChange={(event) => handleSearch(event.target.value)}
        aria-label="Search meetings"
      />
    </div>
  );
}
