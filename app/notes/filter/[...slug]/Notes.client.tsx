"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import NoteList from "@/components/NoteList/NoteList";
import css from "./NotesPage.module.css";
import { fetchNotes } from "@/lib/api";
import { useState } from "react";
import SearchBox from "@/components/SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "@/components/Pagination/Pagination";
import Link from "next/link";

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, 500);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", page, searchQuery, tag],
    queryFn: () => fetchNotes(page, 12, searchQuery, tag),
    placeholderData: keepPreviousData,
  });
  if (isLoading) {
    return <p>"Loading..."</p>;
  }
  if (isError) return error.message;

  if (!data) {
    return null;
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={debouncedSearch} />

        {data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}
