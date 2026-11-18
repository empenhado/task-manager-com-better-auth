"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth"; // ajuste para o caminho da sua instância do Better Auth
import { prisma } from "@/lib/prisma"; // ajuste para o caminho da sua instância do Prisma
import type { TaskFormData } from "@/components/forms/task-form";

type ActionResult =
  | { success: true }
  | { success: false; error: string };

async function getAuthenticatedUserId(): Promise<string | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user?.id ?? null;
}

export async function createTask(data: TaskFormData): Promise<ActionResult> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, error: "Não autorizado." };

  try {
    await prisma.task.create({
      data: {
        title: data.title.trim(),
        description: data.description?.trim() || null,
        userId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao criar tarefa." };
  }
}

export async function updateTask(
  id: string,
  data: TaskFormData
): Promise<ActionResult> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, error: "Não autorizado." };

  try {
    await prisma.task.updateMany({
      where: { id, userId },
      data: {
        title: data.title.trim(),
        description: data.description?.trim() || null,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao atualizar tarefa." };
  }
}

export async function toggleTask(
  id: string,
  completed: boolean
): Promise<ActionResult> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, error: "Não autorizado." };

  try {
    await prisma.task.updateMany({
      where: { id, userId },
      data: { completed },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao atualizar status da tarefa." };
  }
}

export async function deleteTask(id: string): Promise<ActionResult> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, error: "Não autorizado." };

  try {
    await prisma.task.deleteMany({
      where: { id, userId },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao excluir tarefa." };
  }
}