import { notFound } from "next/navigation";
export const dynamicParams = false;
import { youngPeople } from "@/lib/demo-data";
import { CaseloadDetail } from "@/components/workspace/MediatorPages";
export function generateStaticParams() {
  return youngPeople.map(({ id }) => ({ id }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!youngPeople.some((item) => item.id === id)) notFound();
  return <CaseloadDetail id={id} />;
}
