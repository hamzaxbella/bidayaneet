'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BriefcaseBusiness, LayoutDashboard, Users } from 'lucide-react';

type PlatformSwitcherProps = {
  width?: number;
  height?: number;
};

const platforms = [
  { href: '/', label: 'Super Admin', desc: 'Regional command center', icon: LayoutDashboard },
  { href: '/mediator', label: 'Mediator Portal', desc: 'Youth and field workspace', icon: Users },
  { href: '/partner', label: 'Program Collaborator', desc: 'Referrals and opportunities', icon: BriefcaseBusiness },
];

export default function PlatformSwitcher({ width = 150, height = 62 }: PlatformSwitcherProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        title="Switch platform"
        style={{ border: 0, background: 'transparent', padding: 0, cursor: 'pointer', display: 'block' }}
      >
        <Image
          src="/logo.png"
          alt="BidayaNeet platform switcher"
          width={width}
          height={height}
          style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
          priority
        />
      </button>

      {open && (
        <div style={{ position: 'absolute', top: height - 2, left: 0, width: 270, background: 'white', border: '1px solid #E8ECF0', borderRadius: 8, boxShadow: '0 18px 42px rgba(26,43,60,0.16)', padding: 8, zIndex: 1000 }}>
          <div style={{ padding: '8px 10px', borderBottom: '1px solid #F4F6F9', marginBottom: 4 }}>
            <div style={{ fontSize: '0.72rem', color: '#7F8C9A', fontWeight: 800, textTransform: 'uppercase' }}>Switch platform</div>
          </div>
          {platforms.map(({ href, label, desc, icon: Icon }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <a
                key={href}
                href={href}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px', borderRadius: 8, color: '#1A2B3C', textDecoration: 'none', background: active ? '#E0F7F5' : 'transparent' }}
              >
                <span style={{ width: 34, height: 34, borderRadius: 8, background: active ? '#00B8A9' : '#F4F6F9', color: active ? 'white' : '#4A5568', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} />
                </span>
                <span>
                  <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800 }}>{label}</span>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#7F8C9A', marginTop: 2 }}>{desc}</span>
                </span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
