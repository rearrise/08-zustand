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
    openGraph: {
      title: `${notes.title}`,
      description: `${notes.content}`,
      url: "https://08-zustand-nine-ashen-92.vercel.app/",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "notes image",
        },
      ],
    },
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
