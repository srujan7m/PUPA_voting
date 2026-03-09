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
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-linear-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-[#3B2A25]">All Teams</h1>
        </div>
        <p className="text-[#6B5B55]">
          {hasVoted
            ? '✓ You have already cast your vote. Thanks for participating!'
            : 'Browse all 166 teams and cast your vote.'}
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="h-24 bg-[#D6C7B4] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-24 text-[#6B5B55]">No teams found.</div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
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
        </div>
      )}

      <Toaster />
    </div>
  );
}
