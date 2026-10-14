import { LoaderCircle } from "lucide-react";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import "./messages-page.css";

export default function MessagesLoading({ arabic = false }: { arabic?: boolean }) {
  return (
    <div className="messenger-page messenger-loading" dir={arabic ? "rtl" : "ltr"} lang={arabic ? "ar" : "fr"} aria-busy="true">
      <Marker role="status">
        <MarkerIcon><LoaderCircle className="animate-spin" /></MarkerIcon>
        <MarkerContent>{arabic ? "جارٍ تحميل المحادثات…" : "Chargement des conversations…"}</MarkerContent>
      </Marker>
    </div>
  );
}
