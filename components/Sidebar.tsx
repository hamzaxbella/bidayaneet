'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import PlatformSwitcher from '@/components/PlatformSwitcher';
import {
  LayoutDashboard, Users, UserCheck, Briefcase, Star,
  Zap, Map, BarChart2, Bell, Settings, HelpCircle,
  ChevronDown, ExternalLink
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/neets', label: 'NEETs', icon: Users },
  { href: '/mediators', label: 'Mediators', icon: UserCheck },
  { href: '/programs', label: 'Programs', icon: Briefcase },
  { href: '/opportunities', label: 'Opportunities', icon: Star },
  { href: '/micro-actions', label: 'Micro-actions', icon: Zap },
  { href: '/heatmap', label: 'Heatmap', icon: Map },
  { href: '/reports', label: 'Reports', icon: BarChart2 },
  { href: '/alerts', label: 'Alerts', icon: Bell, badge: 6 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 220,
        minWidth: 220,
        height: '100vh',
        background: '#FFFFFF',
        borderRight: '1px solid #E8ECF0',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #E8ECF0' }}>
        <PlatformSwitcher width={160} height={60} />
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-item${isActive ? ' active' : ''}`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span style={{ flex: 1 }}>{label}</span>
              {badge !== undefined && (
                <span
                  style={{
                    background: '#E74C3C',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '1px 7px',
                    minWidth: 20,
                    textAlign: 'center',
                  }}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile + Help */}
      <div style={{ borderTop: '1px solid #E8ECF0', padding: '12px 10px' }}>
        {/* Help */}
        <div
          style={{
            background: '#F4F6F9',
            borderRadius: 12,
            padding: '12px',
            marginBottom: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <HelpCircle size={16} color="#7F8C9A" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4A5568' }}>Need help?</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: '#7F8C9A', marginBottom: 8, lineHeight: 1.4 }}>
            Visit our support center
          </p>
          <a
            href="#"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#00B8A9',
              textDecoration: 'none',
            }}
          >
            Help Center <ExternalLink size={11} />
          </a>
        </div>

        {/* User */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 6px',
            borderRadius: 10,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00B8A9, #1B4F72)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.875rem',
              flexShrink: 0,
            }}
          >
            AE
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1A2B3C', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Amina El Mansouri
            </div>
            <div style={{ fontSize: '0.7rem', color: '#7F8C9A' }}>Regional Admin</div>
          </div>
          <ChevronDown size={14} color="#7F8C9A" />
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid #E8ECF0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Image src="/logo.png" alt="BidayaNeet" width={22} height={22} style={{ objectFit: 'contain' }} />
        <span style={{ fontSize: '0.7rem', color: '#7F8C9A' }}>BidayaNeet © 2025</span>
      </div>
    </aside>
  );
}
