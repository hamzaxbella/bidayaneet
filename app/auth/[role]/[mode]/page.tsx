import { notFound } from "next/navigation";
import AuthPage from "@/components/AuthPage";
export const dynamicParams = false;
import {
  authRoles,
  authModes,
  roleLabels,
  type AuthRole,
  type AuthMode,
} from "@/lib/auth-ui";
export function generateStaticParams() {
  return authRoles.flatMap((role) => authModes.map((mode) => ({ role, mode })));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string; mode: string }>;
}) {
  const { role } = await params;
  return {
    title: `BidayaNeet · ${roleLabels[role as AuthRole] ?? "Connexion"}`,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ role: string; mode: string }>;
}) {
  const { role, mode } = await params;
  if (
    !authRoles.includes(role as AuthRole) ||
    !authModes.includes(mode as AuthMode)
  )
    notFound();
  return <AuthPage role={role as AuthRole} mode={mode as AuthMode} />;
}
