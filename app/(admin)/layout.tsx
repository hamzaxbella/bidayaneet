import WorkspaceShell from "@/components/workspace/WorkspaceShell";

export const metadata = {
  title: "BidayaNeet · Administration",
  description: "Regional youth integration workspace for Souss-Massa",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WorkspaceShell role="admin">{children}</WorkspaceShell>;
}
