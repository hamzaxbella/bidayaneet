"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bookmark, MapPin, Clock3 } from "lucide-react";
import { opportunities } from "@/lib/demo-data";
import { arabicOpportunities } from "@/lib/youth-ar";
import { useYouth } from "./YouthProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
export default function OpportunityCard({
  opportunity: source,
}: {
  opportunity: (typeof opportunities)[number];
}) {
  const opportunity =
    arabicOpportunities.find((item) => item.id === source.id) ?? source;
  const { saved, toggleSaved } = useYouth();
  const isSaved = saved.includes(opportunity.id);
  return (
    <Card className="youth-opportunity-card">
      <div className="opportunity-image">
        <Image
          src={opportunity.image}
          alt=""
          fill
          sizes="(max-width: 650px) 90vw, (max-width: 1100px) 45vw, 30vw"
        />
        <Badge className="youth-match-badge">{opportunity.match}% توافق</Badge>
        <Button
          variant="secondary"
          size="icon"
          className="youth-save-button"
          aria-label={`${isSaved ? "إزالة من" : "إضافة إلى"} المفضلة: ${opportunity.title}`}
          aria-pressed={isSaved}
          onClick={() => toggleSaved(opportunity.id)}
        >
          <Bookmark fill={isSaved ? "currentColor" : "none"} />
        </Button>
      </div>
      <CardHeader>
        <div className="youth-offer-heading">
          <Badge variant="secondary">{opportunity.type}</Badge>
          <bdi>{opportunity.organization}</bdi>
        </div>
        <CardTitle>
          <h3>
          <Link href={`/neet/opportunities/${opportunity.id}`}>
            {opportunity.title}
          </Link>
          </h3>
        </CardTitle>
        <CardDescription>{opportunity.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="card-meta">
          <span>
            <MapPin size={14} />
            {opportunity.location}
          </span>
          <span>
            <Clock3 size={14} />
            {opportunity.duration}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/neet/opportunities/${opportunity.id}`}>
            اكتشف الفرصة
            <ArrowLeft data-icon="inline-end" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
