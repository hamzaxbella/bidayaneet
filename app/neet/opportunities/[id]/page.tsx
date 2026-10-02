import { notFound } from "next/navigation";
export const dynamicParams = false;
import { opportunities } from "@/lib/demo-data";
import { OpportunityDetail } from "@/components/workspace/YouthPages";
export function generateStaticParams() {
  return opportunities.map(({ id }) => ({ id }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!opportunities.some((item) => item.id === id)) notFound();
  return <OpportunityDetail id={id} />;
}
