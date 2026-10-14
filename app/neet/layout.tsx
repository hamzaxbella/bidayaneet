import WorkspaceShell from "@/components/workspace/WorkspaceShell";
import YouthProvider from "@/components/workspace/YouthProvider";
export const metadata = {
  title: "بداية · فضائي",
  description: "فرص ومواكبة لبناء مستقبلك.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <YouthProvider>
      <WorkspaceShell role="neet">{children}</WorkspaceShell>
    </YouthProvider>
  );
}
