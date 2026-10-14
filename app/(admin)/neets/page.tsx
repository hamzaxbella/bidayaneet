import NeetsPage from "@/components/admin/NeetsPage";

export default async function Page({ searchParams }: { searchParams: Promise<{ profile?: string | string[] }> }) {
  const params = await searchParams;
  const profileId = typeof params.profile === "string" ? params.profile : "";
  return <NeetsPage key={profileId} profileId={profileId} />;
}
