import { ProtectedWorkspace } from "@/components/workspace/ProtectedWorkspace";
import WorkspaceShell from "@/components/workspace/WorkspaceShell";

export const metadata = {
  title: "BidayaNeet · Administration",
  description: "Regional youth integration workspace for Souss-Massa",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedWorkspace role="admin">
      <WorkspaceShell role="admin">{children}</WorkspaceShell>
    </ProtectedWorkspace>
  );
}
