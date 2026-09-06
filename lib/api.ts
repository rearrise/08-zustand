import axios from "axios";
import type { CreateNote, Note } from "@/types/note";
import type { NotesResponse } from "@/types/api";

const baseURL = "https://notehub-public.goit.study/api";

export async function fetchNotes(
  page: number,
  perPage: number,
  search: string,
  tag?: string,
): Promise<NotesResponse> {
  const { data } = await axios.get<NotesResponse>(`${baseURL}/notes`, {
    params: {
      page,
      perPage,
      search,
      tag,
    },
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return data;
}

export async function createNote(content: CreateNote): Promise<Note> {
  const { data } = await axios.post<Note>(`${baseURL}/notes`, content, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await axios.delete<Note>(`${baseURL}/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return data;
}

export async function fetchNoteById(id: Note["id"]): Promise<Note> {
  const { data } = await axios.get<Note>(`${baseURL}/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return data;
}
