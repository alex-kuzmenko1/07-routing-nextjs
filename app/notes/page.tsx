import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface NotesPageProps {
  searchParams: {
    page?: string;
    query?: string;
  };
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const page = Number(searchParams.page) || 1;
  const query = searchParams.query || "";

  
  const queryClient = new QueryClient();

  try {
    
    await queryClient.prefetchQuery({
      queryKey: ["notes", page, query],
      queryFn: () => fetchNotes(page, 12, query),
      staleTime: 1000 * 60, // 1 хв
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient />
      </HydrationBoundary>
    );
  } catch (error) {
    console.error("Failed to prefetch notes:", error);

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient />
      </HydrationBoundary>
    );
  }
}
