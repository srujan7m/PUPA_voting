'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, Users, Zap, Settings } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/teams', label: 'Teams', icon: Users },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/setup', label: 'Setup', icon: Settings },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 h-16 flex items-center justify-between px-8"
      style={{
        background: 'rgba(253,250,244,0.82)',
        backdropFilter: 'blur(18px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
        borderBottom: '1px solid rgba(245,158,11,0.15)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group no-underline">
        <div
          className="w-8 h-8 rounded-[9px] flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))',
            boxShadow: '0 2px 8px rgba(245,158,11,0.4)',
          }}
        >
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span
          className="text-[1.15rem] tracking-[-0.01em] transition-colors group-hover:text-[var(--amber-600)]"
          style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--stone-900)' }}
        >
          PUPA Expo
        </span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-[0.9rem] py-[0.45rem] rounded-[8px] text-sm font-medium transition-all duration-150 no-underline"
              style={{
                background: isActive ? 'var(--amber-100)' : 'transparent',
                color: isActive ? 'var(--amber-700)' : 'var(--stone-600)',
                fontWeight: isActive ? 600 : 500,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'var(--amber-50)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--amber-600)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--stone-600)';
                }
              }}
            >
              <Icon className="w-[15px] h-[15px]" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
