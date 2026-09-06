import { fetchNoteById } from "@/lib/api";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
  noop,
} from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import { Metadata } from "next";

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NoteDetailsProps): Promise<Metadata> {
  const { id } = await params;
  const notes = await fetchNoteById(id);
  return {
    title: `${notes.title}`,
    description: `${notes.content}`,
  };
}

export default async function NoteDetailsPage({ params }: NoteDetailsProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient
    .query({
      queryKey: ["note", id],
      queryFn: () => fetchNoteById(id),
    })
    .catch(noop);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
