import { notFound, redirect } from "next/navigation";
import { currentUser } from "@/lib/server/auth";
import { loadPlatform } from "@/lib/server/platform";
import Platform from "@/components/platform/Platform";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/auth/mediator/sign-in");
  const { path = [] } = await params;
  const section = path[0] || "overview";
  const allowed =
    user.role === "admin"
      ? [
          "overview",
          "youth",
          "offers",
          "activities",
          "followup",
          "agenda",
          "messages",
          "team",
          "reports",
          "settings",
        ]
      : user.role === "mediator"
        ? [
            "overview",
            "youth",
            "offers",
            "activities",
            "followup",
            "agenda",
            "messages",
            "reports",
            "settings",
          ]
        : user.role === "partner"
          ? ["overview", "offers", "messages", "settings"]
          : [
              "overview",
              "youth",
              "offers",
              "activities",
              "followup",
              "agenda",
              "messages",
              "settings",
            ];
  if (
    !allowed.includes(section) ||
    path.length > 2 ||
    (path.length === 2 && section !== "youth")
  )
    notFound();
  const initial = await loadPlatform(user);
  if (path[1] && !initial.people.some((p) => p.id === path[1])) notFound();
  return (
    <Platform
      initial={JSON.parse(JSON.stringify(initial))}
      section={section}
      youthId={path[1]}
    />
  );
}
