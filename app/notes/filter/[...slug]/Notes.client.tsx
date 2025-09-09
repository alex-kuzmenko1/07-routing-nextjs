"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import type { PaginatedNotes } from "@/types/pagination";
import type { Note } from "@/types/note";

type NotesClientProps = {
  filter?: string;
  initialPage?: number;
  initialQuery?: string;
};

// Debounce-хук
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function NotesClient({
  filter,
  initialPage = 1,
  initialQuery = "",
}: NotesClientProps) {
  const [search, setSearch] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error } = useQuery<PaginatedNotes, Error>({
    queryKey: ["notes", page, debouncedSearch, filter],
    queryFn: () =>
      fetchNotes(page, 12, debouncedSearch, filter).catch((err) => {
        console.error("Fetch notes error:", err);
        return { notes: [], totalPages: 1, page: 1 };
      }),
    staleTime: 1000 * 60,
    placeholderData: {
      notes: [] as Note[],
      totalPages: 1,
      page: initialPage,
    },
  });

  const notes: Note[] = data?.notes ?? [];
  const totalPages: number = data?.totalPages ?? 1;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);

  return (
    <div>
      <SearchBox value={search} onChange={handleSearchChange} />

      {isLoading && <p>Loading notes...</p>}
      {error && <p>Failed to load notes: {error.message}</p>}

      <NoteList notes={notes} />

      <Pagination
        pageCount={totalPages}
        currentPage={page}
        onPageChange={handlePageChange}
      />

      <button onClick={() => setIsModalOpen(true)}>Create Note</button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
