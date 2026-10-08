import { OpportunitiesPage } from "@/components/workspace/YouthPages";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  return <OpportunitiesPage key={query} initialQuery={query} />;
}
