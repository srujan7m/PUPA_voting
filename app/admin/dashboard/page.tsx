'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, XCircle, Clock, LogOut, Trophy, RefreshCw, Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PendingVoteTeam {
  id: number;
  name: string;
  teamName: string | null;
  teamNumber: number | null;
}

interface PendingVoteEntry {
  id: number;
  mobileNumber: string;
  createdAt: string;
  teams: PendingVoteTeam[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [votes, setVotes] = useState<PendingVoteEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState<number | null>(null);
  const [actionResult, setActionResult] = useState<{ id: number; result: 'approved' | 'denied' } | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch('/api/admin/pending-votes');
      if (res.status === 401) {
        router.replace('/admin');
        return;
      }
      const data = await res.json();
      setVotes(data.pendingVotes ?? []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    load();
    const interval = setInterval(() => load(true), 5000);
    return () => clearInterval(interval);
  }, [load]);

  const handleAction = async (id: number, action: 'approve' | 'deny') => {
    setProcessing(id);
    try {
      const endpoint = action === 'approve'
        ? `/api/admin/approve-vote/${id}`
        : `/api/admin/deny-vote/${id}`;
      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setActionResult({ id, result: action === 'approve' ? 'approved' : 'denied' });
        // Remove after brief animation
        setTimeout(() => {
          setVotes((prev) => prev.filter((v) => v.id !== id));
          setActionResult(null);
        }, 900);
      } else {
        alert(data.error ?? 'Action failed.');
      }
    } catch {
      alert('Network error.');
    } finally {
      setProcessing(null);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin');
  };

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: 'var(--cream)' }}>
      {/* Header */}
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-[10px] flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--amber-400), var(--amber-600))',
                boxShadow: 'var(--shadow-amber)',
              }}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '1.5rem',
                  color: 'var(--stone-900)',
                  lineHeight: 1.1,
                }}
              >
                Voter Desk
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--stone-500)' }}>
                Admin · Pending approvals
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--stone-500)' }}
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/admin/leaderboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium no-underline"
              style={{
                background: 'var(--amber-100)',
                color: 'var(--amber-700)',
                border: '1px solid var(--amber-200)',
              }}
            >
              <Trophy className="w-3.5 h-3.5" />
              Leaderboard
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{ color: 'var(--stone-500)', border: '1px solid var(--stone-200)' }}
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </motion.div>

        {/* Instructions banner */}
        <div
          className="rounded-xl px-4 py-3 mb-6 text-sm"
          style={{
            background: 'var(--amber-50)',
            border: '1px solid var(--amber-200)',
            color: 'var(--amber-800)',
          }}
        >
          <strong>How to verify:</strong> Ask the voter to show their mobile number on their phone. Match it with the number shown below, then <strong>Approve</strong> or <strong>Deny</strong>.
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin" style={{ color: 'var(--amber-500)' }} />
          </div>
        ) : votes.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl"
            style={{ border: '1.5px dashed var(--stone-200)', color: 'var(--stone-400)' }}
          >
            <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No pending votes right now</p>
            <p className="text-xs mt-1">Check back when a voter submits</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {votes.map((vote) => {
                const result = actionResult?.id === vote.id ? actionResult.result : null;
                return (
                  <motion.div
                    key={vote.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: result ? 0 : 1,
                      scale: result ? 0.95 : 1,
                      backgroundColor:
                        result === 'approved'
                          ? '#d1fae5'
                          : result === 'denied'
                          ? '#fee2e2'
                          : 'var(--cream-card)',
                    }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl p-4"
                    style={{
                      border: '1px solid var(--stone-200)',
                      boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Mobile number */}
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: 'var(--amber-100)' }}
                        >
                          <Phone className="w-4 h-4" style={{ color: 'var(--amber-600)' }} />
                        </div>
                        <div>
                          <p
                            className="font-mono font-bold text-lg"
                            style={{ color: 'var(--stone-900)', letterSpacing: '0.04em' }}
                          >
                            {vote.mobileNumber}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--stone-400)' }}>
                            {new Date(vote.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {' · '}
                            {vote.teams.length} team{vote.teams.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleAction(vote.id, 'deny')}
                          disabled={processing === vote.id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          style={{
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: '1px solid #fca5a5',
                          }}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Deny
                        </button>
                        <button
                          onClick={() => handleAction(vote.id, 'approve')}
                          disabled={processing === vote.id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          style={{
                            background: '#d1fae5',
                            color: '#059669',
                            border: '1px solid #6ee7b7',
                          }}
                        >
                          {processing === vote.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5" />
                          )}
                          Approve
                        </button>
                      </div>
                    </div>

                    {/* Selected teams */}
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3" style={{ borderTop: '1px solid var(--stone-100)' }}>
                      {vote.teams.map((t) => (
                        <span
                          key={t.id}
                          className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{
                            background: 'var(--amber-50)',
                            color: 'var(--amber-700)',
                            border: '1px solid var(--amber-200)',
                          }}
                        >
                          #{t.teamNumber ?? t.id}
                          {t.teamName ? ` ${t.teamName}` : ''}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
