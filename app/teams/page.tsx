'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TeamCard, { type Team } from '@/components/TeamCard';
import TeamPreviewModal from '@/components/TeamPreviewModal';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { fetchTeams, fetchVoteStatus, submitPendingVote } from '@/lib/api';
import { Users, CheckCircle, Loader2, ThumbsUp, Clock, Phone, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MAX_VOTES = 3;

type VoteStatus = 'none' | 'pending' | 'approved' | 'denied';

function sortByTeamNumber(data: Team[]) {
  return [...data].sort((a, b) => (a.team_number || a.id) - (b.team_number || b.id));
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [voteStatus, setVoteStatus] = useState<VoteStatus>('none');
  const [votedTeamIds, setVotedTeamIds] = useState<number[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [previewTeam, setPreviewTeam] = useState<Team | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Mobile number dialog state
  const [showMobileDialog, setShowMobileDialog] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileError, setMobileError] = useState('');
  const { toast } = useToast();

  const hasVoted = voteStatus === 'approved';

  useEffect(() => {
    fetchTeams()
      .then((res) => setTeams(sortByTeamNumber(res.data)))
      .catch(console.error)
      .finally(() => setLoading(false));

    fetchVoteStatus()
      .then((res) => {
        const { status, votedTeamIds: ids } = res.data;
        setVoteStatus(status ?? 'none');
        if (ids?.length) setVotedTeamIds(ids);
      })
      .catch(console.error);
  }, []);

  const handleToggleSelect = (teamId: number) => {
    if (hasVoted || voteStatus === 'pending') return;
    setSelectedIds((prev) => {
      if (prev.includes(teamId)) return prev.filter((id) => id !== teamId);
      if (prev.length >= MAX_VOTES) return prev;
      return [...prev, teamId];
    });
  };

  // Step 1: open mobile dialog
  const handleSubmitVotes = () => {
    if (selectedIds.length === 0) return;
    setMobileNumber('');
    setMobileError('');
    setShowMobileDialog(true);
  };

  // Step 2: confirm with mobile number → submit pending vote
  const handleConfirmMobile = async () => {
    const cleaned = mobileNumber.replace(/\s/g, '');
    if (!/^\+?[6-9][0-9]{9,12}$/.test(cleaned)) {
      setMobileError('Enter a valid 10-digit mobile number.');
      return;
    }
    setIsSubmitting(true);
    setMobileError('');
    try {
      await submitPendingVote(selectedIds, cleaned);
      setShowMobileDialog(false);
      setVoteStatus('pending');
      setSelectedIds([]);
      setPreviewTeam(null);
      toast({
        title: '⏳ Vote submitted for verification',
        description: 'Please show your phone to the admin at the desk to complete your vote.',
      });
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.';
      setMobileError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Allow retry if vote was denied
  const handleRetryAfterDeny = () => {
    setVoteStatus('none');
    setSelectedIds([]);
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
              {voteStatus === 'approved'
                ? `✓ You voted for ${votedTeamIds.length} team${votedTeamIds.length !== 1 ? 's' : ''} — thanks for participating!`
                : voteStatus === 'pending'
                ? '⏳ Your vote is pending admin verification at the desk'
                : voteStatus === 'denied'
                ? '✗ Your vote was not approved — you may vote again'
                : `${teams.length} teams · click any card to view details and select up to ${MAX_VOTES} to vote for`}
            </p>
          </div>
        </div>

        {/* Status badge */}
        {voteStatus === 'approved' && (
          <div
            className="flex items-center gap-1.5 text-[0.75rem] font-semibold px-3 py-1.5 rounded-full"
            style={{ background: 'var(--amber-100)', color: 'var(--amber-700)', border: '1px solid var(--amber-200)' }}
          >
            <CheckCircle className="w-3.5 h-3.5" /> Voted
          </div>
        )}
        {voteStatus === 'pending' && (
          <div
            className="flex items-center gap-1.5 text-[0.75rem] font-semibold px-3 py-1.5 rounded-full"
            style={{ background: '#FEF9EE', color: '#B45309', border: '1px solid #FDE68A' }}
          >
            <Clock className="w-3.5 h-3.5" /> Pending
          </div>
        )}
        {voteStatus === 'denied' && (
          <div
            className="flex items-center gap-1.5 text-[0.75rem] font-semibold px-3 py-1.5 rounded-full"
            style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
          >
            <XCircle className="w-3.5 h-3.5" /> Denied
          </div>
        )}
      </motion.div>

      {/* Pending banner */}
      {voteStatus === 'pending' && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 px-5 py-4 rounded-xl flex items-start gap-3"
          style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A' }}
        >
          <Clock className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#B45309' }} />
          <div>
            <p className="font-semibold text-sm" style={{ color: '#92400E' }}>Waiting for admin approval</p>
            <p className="text-xs mt-0.5" style={{ color: '#B45309' }}>
              Please go to the voter desk and show your mobile number to the admin. Your vote will be confirmed once approved.
            </p>
          </div>
        </motion.div>
      )}

      {/* Denied banner */}
      {voteStatus === 'denied' && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 px-5 py-4 rounded-xl flex items-start justify-between gap-3"
          style={{ background: '#FEF2F2', border: '1.5px solid #FECACA' }}
        >
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#DC2626' }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: '#991B1B' }}>Vote not approved</p>
              <p className="text-xs mt-0.5" style={{ color: '#DC2626' }}>
                The admin denied your vote. Please contact the voter desk if you believe this is a mistake — or re-select and re-submit.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleRetryAfterDeny}
            className="shrink-0 text-xs"
            style={{ background: '#DC2626', color: '#fff', border: 'none' }}
          >
            Retry
          </Button>
        </motion.div>
      )}

      {/* Selection indicator (pre-submission) */}
      {voteStatus === 'none' && selectedIds.length > 0 && (
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
        hasVoted={hasVoted || voteStatus === 'pending'}
        votedTeamIds={votedTeamIds}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        maxVotes={MAX_VOTES}
      />

      {/* Sticky bottom submit bar */}
      <AnimatePresence>
        {voteStatus === 'none' && selectedIds.length > 0 && (
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
                  <ThumbsUp className="w-4 h-4" />
                  Submit {selectedIds.length} Vote{selectedIds.length !== 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile number dialog */}
      <AnimatePresence>
        {showMobileDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowMobileDialog(false); }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 30 }}
              className="w-full max-w-sm rounded-2xl p-6"
              style={{ background: 'var(--cream-card)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'var(--amber-100)' }}
                >
                  <Phone className="w-5 h-5" style={{ color: 'var(--amber-600)' }} />
                </div>
                <div>
                  <h2 className="font-bold" style={{ color: 'var(--stone-900)', fontSize: '1rem' }}>
                    Enter your mobile number
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--stone-500)' }}>
                    The admin will verify this at the voter desk
                  </p>
                </div>
              </div>

              <input
                type="tel"
                inputMode="numeric"
                placeholder="e.g. 9876543210"
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value.replace(/[^\d+\s]/g, ''));
                  setMobileError('');
                }}
                className="w-full px-4 py-3 rounded-xl text-base font-mono outline-none transition-all mb-1"
                style={{
                  background: 'var(--cream)',
                  border: `1.5px solid ${mobileError ? '#ef4444' : 'var(--stone-200)'}`,
                  color: 'var(--stone-900)',
                  letterSpacing: '0.06em',
                }}
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmMobile(); }}
              />
              {mobileError && (
                <p className="text-xs mb-3" style={{ color: '#ef4444' }}>
                  {mobileError}
                </p>
              )}

              <p className="text-xs mb-4" style={{ color: 'var(--stone-400)' }}>
                Show this number on your phone screen when the admin asks. Your vote is only counted once verified.
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowMobileDialog(false)}
                  disabled={isSubmitting}
                  style={{ borderColor: 'var(--stone-200)', color: 'var(--stone-600)' }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 font-bold text-white"
                  onClick={handleConfirmMobile}
                  disabled={isSubmitting || !mobileNumber}
                  style={{ background: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))', border: 'none' }}
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Submitting…</>
                  ) : (
                    'Submit Vote'
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster />
    </div>
  );
}
