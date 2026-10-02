import WorkspaceShell from "@/components/workspace/WorkspaceShell";
export const metadata = {
  title: "BidayaNeet · Médiation",
  description:
    "Un espace dédié à l’accompagnement, aux rendez-vous et aux orientations des jeunes.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <WorkspaceShell role="mediator">{children}</WorkspaceShell>;
}
