'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchLeaderboard } from '@/lib/api';
import { Trophy, RefreshCw, Zap, Clock } from 'lucide-react';

interface LeaderboardEntry {
  id: number;
  name: string;
  team_name: string;
  team_number: number;
  vote_count: number;
  rank: number;
}

export default function LeaderboardPage() {
  const [results, setResults] = useState<LeaderboardEntry[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    try {
      const res = await fetchLeaderboard();
      setResults(res.data.results);
      setTotalVotes(res.data.totalVotes);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(() => load(), 10_000);
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="px-8 pt-12 pb-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-[10px] flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--amber-400), var(--amber-600))', boxShadow: 'var(--shadow-amber)' }}
            >
              <Trophy className="w-[22px] h-[22px] text-white" />
            </div>
            <div>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.9rem', color: 'var(--stone-900)', lineHeight: 1.1 }}>
                Leaderboard
              </h1>
              <p className="text-[0.85rem] mt-0.5" style={{ color: 'var(--stone-500)' }}>
                Live rankings updated every 10 seconds
              </p>
            </div>
          </div>
          <Button
            onClick={() => load(true)}
            variant="outline"
            size="sm"
            disabled={refreshing}
            className="gap-2 font-semibold text-sm transition-all duration-150 hover:text-amber-600 hover:border-amber-400 hover:bg-[var(--amber-50)]"
            style={{ borderColor: 'var(--stone-300)', color: 'var(--stone-700)', background: 'transparent' }}
          >
            <RefreshCw className={`w-[13px] h-[13px] ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="flex items-center gap-2 text-[0.82rem] font-semibold px-3.5 py-1.5 rounded-[10px]"
            style={{ background: 'var(--cream-card)', border: '1px solid var(--stone-200)', color: 'var(--stone-700)', boxShadow: 'var(--shadow-sm)' }}
          >
            <Zap className="w-3.5 h-3.5" style={{ color: 'var(--amber-500)' }} />
            {totalVotes.toLocaleString()} total votes
          </div>
          <div
            className="flex items-center gap-2 text-[0.82rem] font-semibold px-3.5 py-1.5 rounded-[10px]"
            style={{ background: 'var(--cream-card)', border: '1px solid var(--stone-200)', color: 'var(--stone-700)', boxShadow: 'var(--shadow-sm)' }}
          >
            <Clock className="w-3.5 h-3.5" style={{ color: 'var(--amber-500)' }} />
            Updated {lastUpdated.toLocaleTimeString()}
          </div>
          <div className="flex items-center gap-2 text-[0.78rem] font-semibold" style={{ color: 'var(--green-600)' }}>
            <span className="pulse-dot" />
            Auto-refreshing
          </div>
        </div>
      </motion.div>

      {/* List */}
      <div className="max-w-[900px] mx-auto px-8 pb-16 flex flex-col gap-[0.55rem]">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="h-20 rounded-[16px] skeleton-shimmer" />
          ))
        ) : results.length === 0 ? (
          <div className="text-center py-24" style={{ color: 'var(--stone-500)' }}>No votes have been cast yet.</div>
        ) : (
          results.map((entry, index) => {
            const pct = totalVotes > 0 ? Math.round((Number(entry.vote_count) / Number(totalVotes)) * 100) : 0;
            const barPct = Math.round((Number(entry.vote_count) / maxVotes) * 100);
            const rowStyle = getRowStyle(entry.rank);
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.4 }}
                whileHover={{ x: 3, transition: { duration: 0.15 } }}
                className="flex items-center gap-4 px-5 py-4 rounded-[16px] cursor-default transition-shadow duration-150"
                style={{ border: `1px solid ${rowStyle.borderColor}`, background: rowStyle.background, boxShadow: 'var(--shadow-sm)' }}
              >
                {/* Rank badge */}
                <div
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 text-[0.8rem] font-extrabold"
                  style={getRankBadgeStyle(entry.rank)}
                >
                  {rankLabel(entry.rank)}
                </div>

                {/* Info */}
                <div className="grow min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-bold text-[0.95rem]" style={{ color: 'var(--stone-800)' }}>
                      {entry.team_name || entry.name}
                    </span>
                    <span
                      className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--stone-100)', color: 'var(--stone-600)', border: '1px solid var(--stone-200)' }}
                    >
                      #{entry.team_number || entry.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="grow h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--stone-200)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barPct}%` }}
                        transition={{ duration: 0.9, delay: index * 0.04 }}
                        className="h-full rounded-full"
                        style={{ background: getBarStyle(entry.rank) }}
                      />
                    </div>
                    <span className="text-[0.7rem] shrink-0 w-8 text-right" style={{ color: 'var(--stone-400)' }}>
                      {pct}%
                    </span>
                  </div>
                </div>

                {/* Vote count */}
                <div className="shrink-0 text-right min-w-[50px]">
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', color: 'var(--stone-800)', lineHeight: 1 }}>
                    {entry.vote_count}
                  </div>
                  <div className="text-[0.68rem] font-medium" style={{ color: 'var(--stone-400)' }}>votes</div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
