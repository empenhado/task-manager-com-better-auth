import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma"; // se der erro aqui, veja a nota abaixo
import { logout } from "@/components/actions/auth/logout";
import { Button } from "@/components/ui/button";
import { TaskDashboard } from "@/components/task-dashboard";

export default async function DashBoardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <span className="text-sm text-muted-foreground">
          Olá, <strong>{session.user.name}</strong>
        </span>

        <form action={logout}>
          <Button type="submit" variant="destructive" size="sm">
            Logout
          </Button>
        </form>
      </header>

      <main className="py-6">
        <TaskDashboard tasks={tasks} />
      </main>
    </div>
  );
}