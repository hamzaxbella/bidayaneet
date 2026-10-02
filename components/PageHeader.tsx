"use client";
import { CalendarDays, Download } from "lucide-react";
import { downloadCsv } from "@/lib/export-csv";
interface PageHeaderProps {
  title: string;
  subtitle: string;
  actionLabel: string;
  actionIcon?: React.ReactNode;
  showFilters?: boolean;
  searchPlaceholder?: string;
}
export default function PageHeader({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  showFilters = true,
}: PageHeaderProps) {
  return (
    <div className="admin-header">
      <div className="admin-header-main">
        <div>
          <div className="eyebrow">SOUSS-MASSA · REGIONAL IMPACT</div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="admin-header-tools">
          <button
            className="button button-secondary"
            onClick={() =>
              downloadCsv("bidayaneet-regional-overview-demo.csv", [
                ["Metric", "Value", "Period", "Source"],
                ["Identified young people", 1842, "May 2025", "Demonstration"],
                ["Activated", 1102, "May 2025", "Demonstration"],
                ["Integrated", 682, "May 2025", "Demonstration"],
                ["Stabilized", 321, "May 2025", "Demonstration"],
              ])
            }
          >
            {actionIcon ?? <Download size={15} />} {actionLabel}
          </button>
        </div>
      </div>
      {showFilters && (
        <div className="admin-period">
          <CalendarDays size={13} />
          <span>May 2025 · Sample reporting period</span>
        </div>
      )}
    </div>
  );
}
