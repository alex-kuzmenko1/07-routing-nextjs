import axios, { AxiosResponse } from "axios";
import type { Note } from "@/types/note";
import type { PaginatedNotes } from "@/types/pagination";

const API_URL = "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN ?? ""}`,
    "Content-Type": "application/json",
  },
});

export async function fetchNotes(
  page: number,
  perPage: number,
  search?: string
): Promise<PaginatedNotes> {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;

  const { data }: AxiosResponse<PaginatedNotes> = await api.get("/notes", {
    params,
  });

  
  return data;
}

export async function createNote(note: {
  title: string;
  content: string;
  tag: Note["tag"];
}): Promise<Note> {
  const { data }: AxiosResponse<Note> = await api.post("/notes", note);
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data }: AxiosResponse<Note> = await api.get(`/notes/${id}`);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data }: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return data;
}
