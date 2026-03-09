'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchLeaderboard } from '@/lib/api';
import { Trophy, Medal, RefreshCw, TrendingUp } from 'lucide-react';

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
    const interval = setInterval(() => load(), 10_000); // auto-refresh every 10 s
    return () => clearInterval(interval);
  }, [load]);

  const getRankGradient = (rank: number) => {
    if (rank === 1) return 'from-yellow-500 to-orange-400';
    if (rank === 2) return 'from-slate-400 to-slate-300';
    if (rank === 3) return 'from-amber-600 to-amber-500';
    return 'from-[#F59E0B] to-[#D97706]';
  };

  const getRankBorder = (rank: number) => {
    if (rank === 1) return 'border-yellow-400/40 bg-yellow-50';
    if (rank === 2) return 'border-slate-300/40 bg-slate-50';
    if (rank === 3) return 'border-amber-400/40 bg-amber-50';
    return 'border-[#D6C7B4] bg-[#FFF9F2]';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-500" />;
    return <span className="text-sm font-bold text-[#6B5B55]">#{rank}</span>;
  };

  const maxVotes = results.length > 0 ? Math.max(...results.map((r) => Number(r.vote_count)), 1) : 1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-start justify-between gap-4 mb-10"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-linear-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-[#3B2A25]">Leaderboard</h1>
          </div>
          <p className="text-[#6B5B55] text-sm">
            Total votes:{' '}
            <span className="text-[#3B2A25] font-semibold">{totalVotes}</span>
            <span className="mx-2 text-[#D6C7B4]">·</span>
            <span className="text-[#7A5A4F]">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          </p>
        </div>

        <Button
          onClick={() => load(true)}
          variant="outline"
          size="sm"
          disabled={refreshing}
          className="border-[#4A2C24] text-[#4A2C24] hover:bg-[#4A2C24] hover:text-white gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Auto-refresh indicator */}
      <div className="flex items-center gap-2 text-xs text-[#6B5B55] mb-7">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        Auto-refreshing every 10 seconds
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
              <div key={i} className="h-20 bg-[#D6C7B4] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-24 text-[#6B5B55]">No votes have been cast yet.</div>
      ) : (
        <div className="space-y-3">
          {results.map((entry, index) => {
            const pct = totalVotes > 0 ? Math.round((Number(entry.vote_count) / Number(totalVotes)) * 100) : 0;
            const barPct = Math.round((Number(entry.vote_count) / maxVotes) * 100);
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ x: 4, transition: { duration: 0.15 } }}
              >
                <div className={`rounded-xl border p-5 transition-all ${getRankBorder(entry.rank)}`}>
                  <div className="flex items-center gap-4">
                    {/* Rank badge */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-linear-to-br ${getRankGradient(entry.rank)} shadow-md`}
                    >
                      {entry.rank <= 3 ? (
                        getRankIcon(entry.rank)
                      ) : (
                        <span className="text-sm font-bold text-white">#{entry.rank}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="grow min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-[#3B2A25] text-sm truncate">
                          {entry.team_name || entry.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="border-[#D6C7B4] text-[#6B5B55] text-xs font-mono shrink-0"
                        >
                          #{entry.team_number || entry.id}
                        </Badge>

                      </div>
                      {/* Progress bar */}
                      <div className="flex items-center gap-3">
                        <div className="grow h-1.5 bg-[#D6C7B4] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${barPct}%` }}
                            transition={{ duration: 0.9, delay: index * 0.06 }}
                            className={`h-full rounded-full bg-linear-to-r ${getRankGradient(entry.rank)}`}
                          />
                        </div>
                        <span className="text-[#6B5B55] text-xs shrink-0 w-8 text-right">
                          {pct}%
                        </span>
                      </div>
                    </div>

                    {/* Vote count */}
                    <div className="shrink-0 text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
                        <span className="text-2xl font-extrabold text-[#3B2A25] leading-none">
                          {entry.vote_count}
                        </span>
                      </div>
                      <p className="text-[#6B5B55] text-xs mt-0.5">votes</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
