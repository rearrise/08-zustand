import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NoteData {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

interface NoteStore {
  draft: NoteData;
  setDraft: (newDraft: NoteData) => void;
  clearDraft: () => void;
}

const initialDraft: NoteData = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (newDraft) => set({ draft: newDraft }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "draft-store",
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);
