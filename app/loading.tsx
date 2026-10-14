"use client";

import { usePathname } from "next/navigation";

export default function Loading() {
  const path = usePathname();
  const arabic = path.startsWith("/neet") || path.startsWith("/auth/neet");
  const french = path.startsWith("/mediator") || path.startsWith("/auth/mediator");
  return (
    <div className="loading-state" role="status" aria-live="polite" lang={arabic ? "ar" : french ? "fr" : "en"} dir={arabic ? "rtl" : undefined} style={arabic ? { fontFamily: "Cairo, Arial, sans-serif" } : undefined}>
      <span className="loading-dot" aria-hidden="true" />
      {arabic ? "جارٍ تجهيز فضائك…" : french ? "Préparation de ton espace…" : "Preparing your workspace…"}
    </div>
  );
}
