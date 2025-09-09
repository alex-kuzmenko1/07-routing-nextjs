"use client";
import { fetchNoteById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";

export default function PreviewModal() {
  const router = useRouter();
  const close = () => router.back();

  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id!),
    enabled: !!id,
    refetchOnMount: false,
    staleTime: 1000 * 60,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note)
    return (
      <p>{error instanceof Error ? error.message : "Something went wrong."}</p>
    );

  const formattedDate = note.created_at
    ? `Created at: ${new Date(note.created_at).toLocaleDateString()}`
    : "";

  return (
    <Modal onClose={close}>
      <button onClick={close} className={css.backBtn}>
        Close
      </button>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{formattedDate}</p>
        </div>
      </div>
    </Modal>
  );
}
