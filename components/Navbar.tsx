'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, Users, Zap } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/teams', label: 'Teams', icon: Users },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#FFF9F2]/90 backdrop-blur-md border-b border-[#D6C7B4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-linear-to-br from-[#F59E0B] to-[#D97706] rounded-lg flex items-center justify-center shadow-lg shadow-[#F59E0B]/20"
            >
              <Zap className="w-4 h-4 text-white" />
            </motion.div>
            <span className="font-bold text-[#4A2C24] text-lg tracking-tight group-hover:text-[#F59E0B] transition-colors">
              PUPA Expo
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-[#4A2C24] bg-[#F59E0B]/15'
                      : 'text-[#6B5B55] hover:text-[#4A2C24] hover:bg-[#F59E0B]/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}


          </div>
        </div>
      </div>
    </nav>
  );
}
