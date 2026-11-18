"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const taskSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  description: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;

type ActionResult =
  | { success: true }
  | { success: false; error: string };

interface TaskFormProps {
  defaultValues?: {
    title: string;
    description: string;
  };
  submitLabel: string;
  successMessage: string;
  onSubmit: (data: TaskFormData) => Promise<ActionResult>;
  resetOnSuccess?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TaskForm({
  defaultValues = { title: "", description: "" },
  submitLabel,
  successMessage,
  onSubmit,
  resetOnSuccess = false,
  onSuccess,
  onCancel,
}: TaskFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  async function handleFormSubmit(data: TaskFormData) {
    setLoading(true);
    try {
      const res = await onSubmit(data);
      if (res.success) {
        toast.success(successMessage);
        if (resetOnSuccess) {
          form.reset({ title: "", description: "" });
        }
        onSuccess?.();
      } else {
        toast.error(res.error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-title">Título</FieldLabel>
              <Input
                {...field}
                id="task-title"
                aria-invalid={fieldState.invalid}
                placeholder="Ex: Estudar Better Auth"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-description">
                Descrição (opcional)
              </FieldLabel>
              <Input
                {...field}
                id="task-description"
                aria-invalid={fieldState.invalid}
                placeholder="Detalhes da tarefa..."
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}