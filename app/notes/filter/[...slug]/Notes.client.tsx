"use client";

import { useState } from "react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import type { PaginatedNotes } from "@/types/pagination";

export default function NotesClient() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryOptions: UseQueryOptions<PaginatedNotes, Error> = {
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, 12, search),
    staleTime: 1000 * 60,
    // keepPreviousData: true, 
  };

  const { data, isLoading, error } = useQuery<PaginatedNotes, Error>(queryOptions);

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div>
      <SearchBox value={search} onChange={handleSearchChange} />
      <button onClick={() => setIsModalOpen(true)} style={{ margin: "1rem 0" }}>
        Create New Note
      </button>

      {isLoading && <p>Loading notes...</p>}
      {error && <p>Failed to load notes: {error.message}</p>}

      <NoteList notes={notes} />

      <Pagination currentPage={page} pageCount={totalPages} onPageChange={handlePageChange} />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
