import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";

export function PageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-intro">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
export function Panel({
  title,
  note,
  href,
  children,
  className = "",
}: {
  title?: string;
  note?: string;
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      {title && (
        <div className="panel-heading">
          <div>
            <h2>{title}</h2>
            {note && <p>{note}</p>}
          </div>
          {href && (
            <Link href={href} className="text-link">
              Tout voir <ArrowRight size={15} />
            </Link>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
export function Tag({
  children,
  tone = "teal",
}: {
  children: ReactNode;
  tone?: "teal" | "orange" | "blue" | "muted" | "purple";
}) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}
export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="empty-state">
      <Inbox size={32} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
export function Metric({
  label,
  value,
  note,
  icon,
}: {
  label: string;
  value: string | number;
  note: string;
  icon: ReactNode;
}) {
  return (
    <div className="metric">
      <div className="metric-top">
        <span>{label}</span>
        <span className="metric-icon">{icon}</span>
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}
