"use client";

import { useId } from "react";
import css from "./NoteForm.module.css";
import { createNote } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useNoteStore } from "@/lib/store/noteStore";

export default function NoteForm() {
  const queryClient = useQueryClient();
  const fieldId = useId();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.push("/notes/filter/all");
    },
    onError(error) {
      console.log(error);
      alert("Error happened!");
    },
  });

  const handleSubmit = (formData: FormData) => {
    mutate(draft);
  };
  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          id={`${fieldId}-title`}
          type="text"
          name="title"
          required
          className={css.input}
          defaultValue={draft.title}
          onChange={(e) => {
            setDraft({ title: e.target.value });
          }}
        />
        <p className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          id={`${fieldId}-content`}
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          onChange={(e) => {
            setDraft({ content: e.target.value });
          }}
        />
        <p className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          id={`${fieldId}-tag`}
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          onChange={(e) => {
            setDraft({ tag: e.target.value });
          }}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        <p className={css.error} />
      </div>

      <div className={css.actions}>
        <Link href="/notes/filter/all" className={css.cancelButton}>
          Cancel
        </Link>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          {isPending ? "Creating" : "Create"}
        </button>
      </div>
    </form>
  );
}
