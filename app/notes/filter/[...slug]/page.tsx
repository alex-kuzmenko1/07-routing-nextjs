import { fetchNotes } from "@/lib/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams?: { page?: string; query?: string };
};

export default async function Notes({ params, searchParams }: Props) {
  const { slug } = await params;

  const page = Number(searchParams?.page) || 1;
  const query = searchParams?.query || "";

  const filter = slug[0] === "All" ? undefined : slug[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", page, query, filter],
    queryFn: () => fetchNotes(page, 12, query, filter),
    staleTime: 1000 * 60,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient filter={filter} />
    </HydrationBoundary>
  );
}
