'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, ArrowLeft, Clock, Loader2, Shield } from 'lucide-react';
import Link from 'next/link';

interface LeaderboardEntry {
  id: number;
  name: string;
  team_name: string;
  team_number: number;
  vote_count: number;
  rank: number;
}

export default function AdminLeaderboardPage() {
  const router = useRouter();
  const [results, setResults] = useState<LeaderboardEntry[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const res = await fetch('/api/admin/leaderboard');
        if (res.status === 401) {
          router.replace('/admin');
          return;
        }
        const data = await res.json();
        setResults(data.results ?? []);
        setTotalVotes(data.totalVotes ?? 0);
        setTotalPending(data.totalPending ?? 0);
        setLastUpdated(new Date());
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [router]
  );

  useEffect(() => {
    load();
    const interval = setInterval(() => load(true), 120_000);
    return () => clearInterval(interval);
  }, [load]);

  const maxVotes = results.length > 0 ? Math.max(...results.map((r) => Number(r.vote_count)), 1) : 1;

  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) return { background: 'linear-gradient(135deg, #FBBF24, #D97706)', color: '#fff', boxShadow: '0 3px 10px rgba(245,158,11,0.4)' };
    if (rank === 2) return { background: 'linear-gradient(135deg, #CBD5E1, #94A3B8)', color: '#fff', boxShadow: '0 3px 10px rgba(148,163,184,0.4)' };
    if (rank === 3) return { background: 'linear-gradient(135deg, #FCD9A8, #D97706)', color: '#fff', boxShadow: '0 3px 10px rgba(217,119,6,0.3)' };
    return { background: 'var(--amber-100)', color: 'var(--amber-700)' };
  };

  const getRowStyle = (rank: number) => {
    if (rank === 1) return { background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', borderColor: '#FDE68A' };
    if (rank === 2) return { background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)', borderColor: '#CBD5E1' };
    if (rank === 3) return { background: 'linear-gradient(135deg, #FFFAF5 0%, #FEF2E4 100%)', borderColor: '#FCD9A8' };
    return { background: 'var(--cream-card)', borderColor: 'var(--stone-200)' };
  };

  const getBarStyle = (rank: number) => {
    if (rank === 1) return 'linear-gradient(90deg, #FBBF24, #D97706)';
    if (rank === 2) return 'linear-gradient(90deg, #94A3B8, #64748B)';
    if (rank === 3) return 'linear-gradient(90deg, #FCD9A8, #D97706)';
    return 'linear-gradient(90deg, var(--amber-400), var(--amber-600))';
  };

  const rankLabel = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-8 pt-10 pb-6"
      >
        <div className="max-w-2xl mx-auto">
          {/* Back + Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-[10px] flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, var(--amber-400), var(--amber-600))',
                  boxShadow: 'var(--shadow-amber)',
                }}
              >
                <Trophy className="w-5.5 h-5.5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: '1.9rem',
                      color: 'var(--stone-900)',
                      lineHeight: 1.1,
                    }}
                  >
                    Leaderboard
                  </h1>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={{ background: 'var(--amber-100)', color: 'var(--amber-700)' }}
                  >
                    <Shield className="w-3 h-3" />
                    Admin
                  </span>
                </div>
                <p className="text-[0.85rem] mt-0.5" style={{ color: 'var(--stone-500)' }}>
                  Live · auto-updates every 2 min
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => load(true)}
                disabled={refreshing}
                className="p-2 rounded-lg"
                style={{ color: 'var(--stone-500)' }}
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium no-underline"
                style={{ color: 'var(--stone-600)', border: '1px solid var(--stone-200)' }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Dashboard
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 mb-6">
            <div
              className="flex-1 rounded-xl px-4 py-3"
              style={{ background: 'var(--cream-card)', border: '1px solid var(--stone-200)' }}
            >
              <p className="text-xs" style={{ color: 'var(--stone-500)' }}>Committed Votes</p>
              <p className="text-2xl font-bold mt-0.5" style={{ color: 'var(--stone-900)' }}>
                {totalVotes}
              </p>
            </div>
            <div
              className="flex-1 rounded-xl px-4 py-3"
              style={{ background: '#FEF9EE', border: '1px solid var(--amber-200)' }}
            >
              <p className="text-xs" style={{ color: 'var(--amber-600)' }}>Pending Approval</p>
              <p className="text-2xl font-bold mt-0.5" style={{ color: 'var(--amber-700)' }}>
                {totalPending}
              </p>
            </div>
            <div
              className="flex-1 rounded-xl px-4 py-3"
              style={{ background: 'var(--cream-card)', border: '1px solid var(--stone-200)' }}
            >
              <p className="text-xs" style={{ color: 'var(--stone-500)' }}>Last updated</p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--stone-700)' }}>
                <Clock className="w-3 h-3 inline mr-1" />
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-7 h-7 animate-spin" style={{ color: 'var(--amber-500)' }} />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-24" style={{ color: 'var(--stone-400)' }}>
              No votes yet.
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-xl p-4"
                  style={{ border: `1px solid ${getRowStyle(entry.rank).borderColor}`, ...getRowStyle(entry.rank) }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold shrink-0"
                      style={getRankBadgeStyle(entry.rank)}
                    >
                      {rankLabel(entry.rank)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm truncate" style={{ color: 'var(--stone-900)' }}>
                          #{entry.team_number} {entry.team_name || entry.name}
                        </p>
                        <span className="font-bold text-lg shrink-0" style={{ color: 'var(--amber-600)' }}>
                          {entry.vote_count}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div
                        className="mt-1.5 h-1.5 rounded-full overflow-hidden"
                        style={{ background: 'rgba(0,0,0,0.06)' }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: getBarStyle(entry.rank) }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(Number(entry.vote_count) / maxVotes) * 100}%` }}
                          transition={{ duration: 0.6, delay: i * 0.03 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
