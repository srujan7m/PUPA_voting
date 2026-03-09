'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, BarChart3 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
};

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden text-center px-8 pt-20 pb-16">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Live badge */}
          <motion.div custom={0} initial="hidden" animate="show" variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.78rem] font-semibold mb-6"
            style={{ background: 'var(--amber-100)', border: '1px solid var(--amber-200)', color: 'var(--amber-700)' }}
          >
            <span className="pulse-dot" />
            Voting is now open · 2026
          </motion.div>

          {/* Heading */}
          <motion.h1
            custom={1} initial="hidden" animate="show" variants={fadeUp}
            className="mb-5 leading-[1.1] tracking-[-0.02em]"
            style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', color: 'var(--stone-900)' }}
          >
            PUPA{' '}
            <span className="bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
              Innovation
            </span>
            <br />Expo
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={2} initial="hidden" animate="show" variants={fadeUp}
            className="text-[1.05rem] leading-[1.7] mb-10 max-w-lg mx-auto font-normal"
            style={{ color: 'var(--stone-500)' }}
          >
            Discover groundbreaking projects from 180 teams. Explore, engage, and cast your vote for the most innovative solutions.
          </motion.p>

          {/* CTAs */}
          <motion.div custom={3} initial="hidden" animate="show" variants={fadeUp}
            className="flex flex-wrap gap-3 justify-center"
          >
            <Link href="/teams">
              <Button
                size="lg"
                className="gap-2 text-white font-semibold px-8 h-12 text-base"
                style={{
                  background: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))',
                  boxShadow: 'var(--shadow-amber)',
                  border: 'none',
                }}
              >
                <Users className="w-4 h-4" />
                Browse Teams
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 font-semibold px-8 h-12 text-base transition-all duration-150 hover:text-amber-600 hover:border-amber-400 hover:bg-[var(--amber-50)]"
                style={{ borderColor: 'var(--stone-300)', color: 'var(--stone-700)', background: 'transparent' }}
              >
                <BarChart3 className="w-4 h-4" />
                View Leaderboard
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats row ── */}
      <motion.div
        custom={4} initial="hidden" animate="show" variants={fadeUp}
        className="flex flex-wrap gap-4 justify-center px-8 pb-12"
      >
        {[
          { value: '180', label: 'Teams Competing' },
          { value: 'Live', label: 'Votes open now', live: true },
          { value: '180', label: 'Projects Showcased' },
        ].map(({ value, label, live }) => (
          <div
            key={label}
            className="min-w-[150px] text-center px-8 py-5 rounded-[16px] transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'var(--cream-card)', border: '1px solid var(--stone-200)', boxShadow: 'var(--shadow-sm)' }}
          >
            {live ? (
              <div className="flex items-center justify-center gap-2 mb-1" style={{ color: 'var(--green-600)' }}>
                <span className="pulse-dot" />
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', lineHeight: 1 }}>Live</span>
              </div>
            ) : (
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: 'var(--stone-900)', lineHeight: 1, marginBottom: '0.25rem' }}>
                {value}
              </p>
            )}
            <p className="text-[0.8rem] font-medium" style={{ color: 'var(--stone-500)', marginTop: live ? 0 : undefined }}>
              {label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* ── CTA Banner ── */}
      <motion.div
        custom={5} initial="hidden" animate="show" variants={fadeUp}
        className="mx-8 mb-16 relative overflow-hidden rounded-[28px] px-12 py-12 flex flex-wrap items-center justify-between gap-8"
        style={{ background: 'linear-gradient(135deg, var(--stone-900) 0%, var(--stone-800) 100%)' }}
      >
        {/* ambient glow */}
        <div
          className="absolute top-[-60px] right-[-60px] w-[250px] h-[250px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)' }}
        />
        <div className="relative z-10">
          <h3 className="text-white mb-1.5" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.7rem' }}>
            Ready to cast your vote?
          </h3>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Browse all projects and support your favourite innovation.
          </p>
        </div>
        <Link href="/teams" className="relative z-10">
          <Button
            size="lg"
            className="gap-2 text-white font-semibold px-10 h-12 text-base"
            style={{
              background: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))',
              boxShadow: 'var(--shadow-amber)',
              border: 'none',
            }}
          >
            Browse and Vote
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
