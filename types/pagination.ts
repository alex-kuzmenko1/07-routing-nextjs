import type { Note } from "./note";

export interface PaginatedNotes {
  page: number;           
  totalPages: number;     
  notes: Note[];          
}

export interface NotesQuery {
  page?: number;
  query?: string;
}
