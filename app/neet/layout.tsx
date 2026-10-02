import WorkspaceShell from "@/components/workspace/WorkspaceShell";
import YouthProvider from "@/components/workspace/YouthProvider";
export const metadata = {
  title: "BidayaNeet · Mon espace",
  description:
    "Des opportunités et un accompagnement pour construire ton avenir.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <YouthProvider>
      <WorkspaceShell role="neet">{children}</WorkspaceShell>
    </YouthProvider>
  );
}
