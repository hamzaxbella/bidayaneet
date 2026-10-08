"use client";
import { CalendarDays, Download, MapPin, Search } from "lucide-react";
import { downloadCsv } from "@/lib/export-csv";
interface PageHeaderProps {
  title: string;
  subtitle: string;
  actionLabel: string;
  actionIcon?: React.ReactNode;
  showFilters?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}
export default function PageHeader({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  showFilters = true,
  searchPlaceholder = "Search NEET profiles...",
  onSearch,
}: PageHeaderProps) {
  return (
    <div className="admin-header">
      <div className="admin-header-main">
        <div>
          <h1>{title}</h1>
          <p>
            <MapPin size={12} /> {subtitle}
          </p>
        </div>
        <div className="admin-header-tools">
          {onSearch && (
            <div className="original-admin-search">
              <Search size={15} />
              <input
                type="search"
                aria-label="Search NEET profiles"
                placeholder={searchPlaceholder}
                onChange={(event) => onSearch(event.target.value)}
              />
            </div>
          )}
          <button
            className="btn-primary"
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
          <span className="original-period">
            <CalendarDays size={13} /> May 1 – May 31, 2025
          </span>
          <span className="original-period">Souss-Massa</span>
          <span>Sample reporting period</span>
        </div>
      )}
    </div>
  );
}
