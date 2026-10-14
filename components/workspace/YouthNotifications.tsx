"use client";
import Link from "next/link";
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCheck,
} from "lucide-react";
import { useSimulatedState } from "@/lib/simulated-backend";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
export default function YouthNotifications({
  role = "neet",
}: {
  role?: "neet" | "mediator";
}) {
  const ar = role === "neet";
  const text = (arabic: string, french: string) => (ar ? arabic : french);
  const [read, setRead] = useSimulatedState(
    `${role}.notifications.read`,
    false,
  );
  return (
    <DropdownMenu dir={ar ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="youth-notification-bell"
          aria-label={text("الإشعارات", "Voir les notifications")}
        >
          <Bell />
          {!read && <span className="youth-unread-dot" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="youth-notification-menu"
        lang={ar ? "ar" : "fr"}
      >
        <DropdownMenuLabel>
          {text("إشعاراتك", "Notifications")}{" "}
          {!read && text("· 2 جديد", "· 2 nouvelles")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href={
                ar ? "/neet/opportunities/marketing" : "/mediator/opportunities"
              }
            >
              <BriefcaseBusiness />
              <span>
                <b>{text("فرصة جديدة تناسبك", "Une nouvelle opportunité")}</b>
                <small>
                  {text(
                    "تدريب في التسويق الرقمي · منذ ساعتين",
                    "Stage marketing digital · il y a 2 h",
                  )}
                </small>
              </span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/${role}/messages`}>
              <CalendarDays />
              <span>
                <b>{text("تذكير بموعد التوجيه", "Rappel de rendez-vous")}</b>
                <small>
                  {text(
                    "تواصل مع إيمان لتأكيد موعدك",
                    "Consultez vos conversations pour confirmer le rendez-vous",
                  )}
                </small>
              </span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setRead(true)}>
            <CheckCheck />
            {read
              ? text(
                  "كل الإشعارات مقروءة",
                  "Toutes les notifications sont lues",
                )
              : text("تحديد الكل كمقروء", "Tout marquer comme lu")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
