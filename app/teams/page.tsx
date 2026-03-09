'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TeamCard, { type Team } from '@/components/TeamCard';
import TeamPreviewModal from '@/components/TeamPreviewModal';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { fetchTeams, fetchVoteStatus, submitVotes } from '@/lib/api';
import { Users, CheckCircle, Loader2, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MAX_VOTES = 3;

function sortByTeamNumber(data: Team[]) {
  return [...data].sort((a, b) => (a.team_number || a.id) - (b.team_number || b.id));
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedTeamIds, setVotedTeamIds] = useState<number[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [previewTeam, setPreviewTeam] = useState<Team | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          setVotedTeamIds(res.data.votedTeamIds ?? []);
        }
      })
      .catch(console.error);
  }, []);

  const handleToggleSelect = (teamId: number) => {
    if (hasVoted) return;
    setSelectedIds((prev) => {
      if (prev.includes(teamId)) return prev.filter((id) => id !== teamId);
      if (prev.length >= MAX_VOTES) return prev;
      return [...prev, teamId];
    });
  };

  const handleSubmitVotes = async () => {
    if (selectedIds.length === 0) return;
    setIsSubmitting(true);
    try {
      await submitVotes(selectedIds);
      setHasVoted(true);
      setVotedTeamIds(selectedIds);
      setSelectedIds([]);
      setPreviewTeam(null);
      toast({
        title: '🎉 Votes recorded!',
        description: `You successfully voted for ${selectedIds.length} team${selectedIds.length > 1 ? 's' : ''}.`,
      });
      fetchTeams()
        .then((res) => setTeams(sortByTeamNumber(res.data)))
        .catch(console.error);
    } catch (err: any) {
      toast({
        title: 'Unable to submit votes',
        description: err.response?.data?.error || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTeams = teams.filter((t) => selectedIds.includes(t.id));

  return (
    <div className="px-8 py-12 pb-40" style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-start justify-between gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-[10px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--amber-400), var(--amber-600))', boxShadow: 'var(--shadow-amber)' }}
          >
            <Users className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.9rem', color: 'var(--stone-900)', lineHeight: 1.1 }}>
              All Teams
            </h1>
            <p className="text-[0.875rem] mt-0.5" style={{ color: 'var(--stone-500)' }}>
              {hasVoted
                ? `✓ You voted for ${votedTeamIds.length} team${votedTeamIds.length !== 1 ? 's' : ''} — thanks for participating!`
                : `${teams.length} teams · click any card to view details and select up to ${MAX_VOTES} to vote for`}
            </p>
          </div>
        </div>
        {hasVoted && (
          <div
            className="flex items-center gap-1.5 text-[0.75rem] font-semibold px-3 py-1.5 rounded-full"
            style={{ background: 'var(--amber-100)', color: 'var(--amber-700)', border: '1px solid var(--amber-200)' }}
          >
            <CheckCircle className="w-3.5 h-3.5" /> Voted
          </div>
        )}
      </motion.div>

      {/* Selection indicator (pre-submission) */}
      {!hasVoted && selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2 mb-6 px-4 py-3 rounded-xl"
          style={{ background: 'var(--amber-50)', border: '1px solid var(--amber-200)' }}
        >
          <span className="text-[0.82rem] font-semibold" style={{ color: 'var(--amber-700)' }}>
            {selectedIds.length}/{MAX_VOTES} selected:
          </span>
          {selectedTeams.map((t) => (
            <span
              key={t.id}
              className="text-[0.75rem] font-medium px-2.5 py-1 rounded-full cursor-pointer"
              style={{ background: 'var(--amber-100)', color: 'var(--amber-700)', border: '1px solid var(--amber-300)' }}
              onClick={() => handleToggleSelect(t.id)}
              title="Click to remove"
            >
              #{t.team_number || t.id}{t.team_name ? ` ${t.team_name}` : ''} ×
            </span>
          ))}
        </motion.div>
      )}

      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="rounded-2xl skeleton-shimmer" style={{ aspectRatio: '3/4' }} />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-24" style={{ color: 'var(--stone-500)' }}>No teams found.</div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.005 } } }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3"
        >
          {teams.map((team, index) => (
            <TeamCard
              key={team.id}
              team={team}
              index={index}
              onClick={setPreviewTeam}
              votedTeamIds={votedTeamIds}
              selectedIds={selectedIds}
            />
          ))}
        </motion.div>
      )}

      {/* Team preview popup */}
      <TeamPreviewModal
        team={previewTeam}
        isOpen={!!previewTeam}
        onClose={() => setPreviewTeam(null)}
        hasVoted={hasVoted}
        votedTeamIds={votedTeamIds}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        maxVotes={MAX_VOTES}
      />

      {/* Sticky bottom submit bar */}
      <AnimatePresence>
        {!hasVoted && selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-3"
            style={{ background: 'linear-gradient(to top, var(--cream) 70%, transparent)' }}
          >
            <div className="max-w-2xl mx-auto">
              <div
                className="flex items-center justify-between gap-4 px-5 py-4 rounded-2xl"
                style={{
                  background: 'var(--cream-card)',
                  border: '1.5px solid var(--amber-300)',
                  boxShadow: '0 8px 40px rgba(245,158,11,0.18)',
                }}
              >
                <div>
                  <p className="font-bold text-sm" style={{ color: 'var(--stone-800)' }}>
                    {selectedIds.length} of {MAX_VOTES} votes selected
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--stone-500)' }}>
                    {selectedIds.length < MAX_VOTES
                      ? `You can still add ${MAX_VOTES - selectedIds.length} more team${MAX_VOTES - selectedIds.length !== 1 ? 's' : ''}`
                      : 'Ready to submit — or keep browsing!'}
                  </p>
                </div>
                <Button
                  onClick={handleSubmitVotes}
                  disabled={isSubmitting}
                  className="gap-2 font-bold text-sm h-11 px-6 text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))', border: 'none', boxShadow: 'var(--shadow-amber)' }}
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                  ) : (
                    <><ThumbsUp className="w-4 h-4" /> Submit {selectedIds.length} Vote{selectedIds.length !== 1 ? 's' : ''}</>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster />
    </div>
  );
}
