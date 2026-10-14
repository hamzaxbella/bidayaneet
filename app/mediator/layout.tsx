import { ProtectedWorkspace } from "@/components/workspace/ProtectedWorkspace";
import WorkspaceShell from "@/components/workspace/WorkspaceShell";
export const metadata = {
  title: "BidayaNeet · Médiation",
  description:
    "Un espace dédié à l’accompagnement, aux rendez-vous et aux orientations des jeunes.",
};
export default async function Layout({ children }: { children: React.ReactNode }) {
  return <ProtectedWorkspace role="mediator"><WorkspaceShell role="mediator">{children}</WorkspaceShell></ProtectedWorkspace>;
}
