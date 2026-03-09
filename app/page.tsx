'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Users, Vote, ChevronDown } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-28 px-4">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#4A2C24]/5 via-transparent to-transparent" />
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 bg-[#F59E0B]/8 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute top-20 left-1/3 w-100 h-75 bg-[#4A2C24]/5 blur-3xl rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-[#4A2C24]/10 border border-[#4A2C24]/30 rounded-full px-4 py-1.5 text-[#4A2C24] text-sm font-medium mb-8"
          >
            <Zap className="w-3.5 h-3.5" />
            Innovation Expo 2026 — Live Voting Open
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#3B2A25] mb-5 leading-[1.08] tracking-tight">
            PUPA{' '}
            <span className="bg-linear-to-r from-[#F59E0B] to-[#D97706] bg-clip-text text-transparent">
              Innovation
            </span>
            <br />
            Expo
          </h1>

          <p className="text-lg sm:text-xl text-[#6B5B55] mb-10 max-w-2xl mx-auto leading-relaxed">
            Scan &nbsp;·&nbsp; Explore &nbsp;·&nbsp; Vote for the Best Innovation
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/teams">
              <Button size="lg" className="bg-[#4A2C24] hover:bg-[#3B2A25] text-white px-8 h-12 text-base font-semibold gap-2 shadow-xl shadow-[#4A2C24]/20">
                View All 180 Teams
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button size="lg" variant="outline" className="border-[#4A2C24] text-[#4A2C24] hover:bg-[#4A2C24] hover:text-white px-8 h-12 text-base font-semibold">
                Leaderboard
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="max-w-lg mx-auto mt-16 grid grid-cols-3 gap-4"
        >
          {[
            { icon: Users, label: 'Teams', value: '180' },
            { icon: Vote, label: 'Voting', value: 'Live' },
            { icon: Zap, label: 'Projects', value: '180' },
          ].map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="bg-[#FFF9F2] border border-[#D6C7B4] rounded-xl p-4 text-center"
            >
              <Icon className="w-5 h-5 text-[#F59E0B] mx-auto mb-1.5" />
              <p className="text-2xl font-bold text-[#3B2A25] leading-none">{value}</p>
              <p className="text-[#6B5B55] text-xs mt-1">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center mt-14"
        >
          <ChevronDown className="w-5 h-5 text-[#D6C7B4] animate-bounce" />
        </motion.div>
      </section>



      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#FFF9F2] border border-[#D6C7B4] rounded-2xl p-10 text-center"
        >
          <h2 className="text-2xl font-extrabold text-[#3B2A25] mb-3">Ready to Cast Your Vote?</h2>
          <p className="text-[#6B5B55] mb-7 max-w-md mx-auto">
            Browse all 180 teams and cast your one vote for the most impressive innovation.
          </p>
          <Link href="/teams">
            <Button size="lg" className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-10 h-12 text-base font-semibold gap-2 shadow-xl shadow-[#F59E0B]/20">
              Browse and Vote
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
