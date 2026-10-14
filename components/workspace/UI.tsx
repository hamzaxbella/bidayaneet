"use client";

import Translated from "@/components/Translated";
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
        {eyebrow && (
          <div className="eyebrow">
            <Translated value={eyebrow} />
          </div>
        )}
        <h1>
          <Translated value={title} />
        </h1>
        <p>
          <Translated value={description} />
        </p>
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
            <h2>
              <Translated value={title} />
            </h2>
            {note && (
              <p>
                <Translated value={note} />
              </p>
            )}
          </div>
          {href && (
            <Link href={href} className="text-link">
              <Translated value="Tout voir" />
              <ArrowRight size={15} />
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
  return (
    <span className={`tag tag-${tone}`}>
      {typeof children === "string" ? (
        <Translated value={children} />
      ) : (
        children
      )}
    </span>
  );
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
      <h3>
        <Translated value={title} />
      </h3>
      <p>
        <Translated value={description} />
      </p>
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
        <span>
          <Translated value={label} />
        </span>
        <span className="metric-icon">{icon}</span>
      </div>
      <strong>{value}</strong>
      <small>
        <Translated value={note} />
      </small>
    </div>
  );
}
