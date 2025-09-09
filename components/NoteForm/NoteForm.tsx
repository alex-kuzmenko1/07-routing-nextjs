"use client";

import { Field, Form, Formik, type FormikHelpers, ErrorMessage } from "formik";
import css from "./NoteForm.module.css";
import { useId } from "react";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import type { Note } from "@/types/note";

interface NoteFormProps {
  onClose: () => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: Note["tag"];
}

const initialValues: FormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long")
    .required("Title is required!"),
  content: Yup.string().max(500, "Content is too long"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required!"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (values: FormValues) => createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
    onError: (err: unknown) => {
      console.log("Failed to create note:", err);
    },
  });

  const fieldId = useId();

  const handleSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    mutate(values, {
      onSuccess: () => {
        actions.resetForm();
      },
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={NoteFormSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field
            id={`${fieldId}-title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage name="title" className={css.error} component="span" />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${fieldId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" className={css.error} component="span" />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <Field
            as="select"
            id={`${fieldId}-tag`}
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" className={css.error} component="span" />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
