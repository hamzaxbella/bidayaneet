"use client";
import { useTranslation as useUiTranslation } from "@/components/LanguageProvider";

import Translated from "@/components/Translated";

import { CalendarDays, Download, MapPin, Search } from "lucide-react";
import { useAdminData } from "@/components/workspace/AdminData";
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
  const { text: uiText } = useUiTranslation();

  const { metrics, data } = useAdminData();
  const today = new Date(data.now).toLocaleDateString("fr-MA",{timeZone:"Africa/Casablanca"});
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
                aria-label={uiText("Search NEET profiles")}
                placeholder={searchPlaceholder}
                onChange={(event) => onSearch(event.target.value)}
              />
            </div>
          )}
          <button
            className="btn-primary"
            onClick={() =>
              downloadCsv("bidayaneet-region.csv", [
                ["Indicateur", "Valeur", "Date"],
                ["Dossiers identifiés", metrics.identified, today],
                ["Activation confirmée", metrics.activated, today],
                ["Insertion constatée", metrics.integrated, today],
                ["Maintien confirmé", metrics.stabilized, today],
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
            <CalendarDays size={13} /> {today}
          </span>
          <span className="original-period">
            {String(data.settings.region || "Souss-Massa")}
          </span>
          <span>
            <Translated value="Données enregistrées" />
          </span>
        </div>
      )}
    </div>
  );
}
