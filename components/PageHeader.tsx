'use client';

import { Search, ChevronDown, Calendar, MapPin } from 'lucide-react';

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
  searchPlaceholder = 'Search NEETs, mediators, programs...',
}: PageHeaderProps) {
  return (
    <div
      style={{
        background: 'white',
        borderBottom: '1px solid #E8ECF0',
        padding: '16px 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: showFilters ? 12 : 0 }}>
        {/* Title */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#1A2B3C' }}>{title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
            <MapPin size={12} color="#7F8C9A" />
            <span style={{ fontSize: '0.78rem', color: '#7F8C9A' }}>{subtitle}</span>
          </div>
        </div>

        {/* Search */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Search size={15} color="#A0ADB8" style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} />
          <input
            type="search"
            placeholder={searchPlaceholder}
            style={{
              paddingLeft: 36,
              paddingRight: 14,
              paddingTop: 8,
              paddingBottom: 8,
              border: '1px solid #E8ECF0',
              borderRadius: 8,
              fontSize: '0.8125rem',
              color: '#1A2B3C',
              background: '#F9FAFB',
              outline: 'none',
              width: 260,
            }}
          />
        </div>

        {/* Action button */}
        <button className="btn-primary">
          {actionIcon}
          {actionLabel}
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn-outline" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
            <Calendar size={13} />
            May 1 – May 31, 2025
            <ChevronDown size={12} />
          </button>
          <button className="btn-outline" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
            All Communes
            <ChevronDown size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
