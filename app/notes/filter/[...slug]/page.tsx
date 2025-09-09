import { fetchNotes } from "@/lib/api";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NotesClient from "./Notes.client";

type Props = {
  params?: { slug?: string[] };
  searchParams?: { page?: string; query?: string };
};

export default async function Notes({ params, searchParams }: Props) {
  // 🔹 дефолтні значення
  const slug = params?.slug ?? [];
  const filter = slug[0] === "All" ? undefined : slug[0];

  const page = Number(searchParams?.page ?? 1);
  const query = searchParams?.query ?? "";

  // 🔹 React Query prefetch
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: ["notes", page, query, filter],
      queryFn: () => fetchNotes(page, 12, query, filter),
      staleTime: 1000 * 60,
    });
  } catch (err) {
    console.error("Error prefetching notes:", err);
  }

  // 🔹 Повертаємо клієнтський компонент
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient filter={filter} initialPage={page} initialQuery={query} />
    </HydrationBoundary>
  );
}
