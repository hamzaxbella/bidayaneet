import { currentUser } from "@/lib/server/auth";
import { loadWorkspace, roleHome } from "@/lib/server/workspace";
import { redirect } from "next/navigation";
import type { Role } from "@/lib/platform-types";
import { LiveProvider } from "./LiveProvider";
export async function ProtectedWorkspace({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect(`/auth/${role}/sign-in`);
  if (user.role !== role) redirect(roleHome[user.role]);
  const initial = await loadWorkspace(user);
  return (
    <LiveProvider initial={JSON.parse(JSON.stringify(initial))}>
      {children}
    </LiveProvider>
  );
}
