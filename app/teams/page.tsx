'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TeamCard, { type Team } from '@/components/TeamCard';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { fetchTeams, fetchVoteStatus, submitVote } from '@/lib/api';
import { Users } from 'lucide-react';

function sortByTeamNumber(data: Team[]) {
  return [...data].sort((a, b) => (a.team_number || a.id) - (b.team_number || b.id));
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedTeamId, setVotedTeamId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeams()
      .then((res) => setTeams(sortByTeamNumber(res.data)))
      .catch(console.error)
      .finally(() => setLoading(false));

    fetchVoteStatus()
      .then((res) => {
        if (res.data.hasVoted) {
          setHasVoted(true);
          setVotedTeamId(res.data.projectId);
        }
      })
      .catch(console.error);
  }, []);

  const handleVote = async (teamId: number) => {
    try {
      await submitVote(teamId);
      setHasVoted(true);
      setVotedTeamId(teamId);
      toast({ title: '🎉 Vote recorded!', description: 'Your vote has been successfully cast.' });
      fetchTeams()
        .then((res) => setTeams(sortByTeamNumber(res.data)))
        .catch(console.error);
    } catch (err: any) {
      toast({
        title: 'Unable to vote',
        description: err.response?.data?.error || 'You have already voted.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="px-8 py-12" style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="flex flex-wrap items-start justify-between gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-[10px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--amber-400), var(--amber-600))', boxShadow: 'var(--shadow-amber)' }}
          >
            <Users className="w-[22px] h-[22px] text-white" />
          </div>
          <div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.9rem', color: 'var(--stone-900)', lineHeight: 1.1 }}>
              All Teams
            </h1>
            <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--stone-500)' }}>
              {hasVoted
                ? '✓ You have already cast your vote — thanks for participating!'
                : '180 teams · sorted by team number · click any card to view details'}
            </p>
          </div>
        </div>
        {hasVoted && (
          <div
            className="flex items-center gap-1.5 text-[0.75rem] font-semibold px-3 py-1.5 rounded-full"
            style={{ background: 'var(--amber-100)', color: 'var(--amber-700)', border: '1px solid var(--amber-200)' }}
          >
            <span>✓</span> Voted
          </div>
        )}
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="h-[82px] rounded-[16px] skeleton-shimmer" />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-24" style={{ color: 'var(--stone-500)' }}>No teams found.</div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.006 } } }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2"
        >
          {teams.map((team, index) => (
            <TeamCard
              key={team.id}
              team={team}
              index={index}
              onVote={handleVote}
              hasVoted={hasVoted}
              votedTeamId={votedTeamId}
            />
          ))}
        </motion.div>
      )}

      <Toaster />
    </div>
  );
}
