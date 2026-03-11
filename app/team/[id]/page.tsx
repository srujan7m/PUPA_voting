'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VoteModal from '@/components/VoteModal';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { fetchTeam, fetchVoteStatus, submitPendingVote } from '@/lib/api';
import { ArrowLeft, Users, ThumbsUp, Video, ChevronLeft, ChevronRight, Phone, Loader2 as Loader } from 'lucide-react';

interface TeamDetail {
  id: number;
  name: string;
  team_name: string;
  team_number: number;
  description: string;
  vote_count: number;
  team_members: string;
  demo_video_url?: string;
  image_url?: string;
  stall_images?: string[];
}

export default function TeamDetailPage() {
  const params = useParams();
  const { toast } = useToast();

  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [voteStatus, setVoteStatus] = useState<'none'|'pending'|'approved'|'denied'>('none');
  const [imgIdx, setImgIdx] = useState(0);
  // Mobile dialog
  const [showMobileDialog, setShowMobileDialog] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileError, setMobileError] = useState('');

  useEffect(() => {
    const id = params.id as string;

    fetchTeam(id)
      .then((res) => setTeam(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));

    // Auto-show vote modal on first visit (QR scan behaviour)
    const key = `pupa_visited_${id}`;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1');
      setTimeout(() => setShowModal(true), 700);
    }

    fetchVoteStatus()
      .then((res) => {
        const { status } = res.data;
        setVoteStatus(status ?? 'none');
        if (status === 'approved') setHasVoted(true);
      })
      .catch(console.error);
  }, [params.id]);

  // Step 1: open mobile dialog from VoteModal
  const handleVote = () => {
    if (!team) return;
    setShowModal(false);
    setMobileNumber('');
    setMobileError('');
    setShowMobileDialog(true);
  };

  // Step 2: confirm mobile number and submit pending vote
  const handleConfirmMobile = async () => {
    if (!team) return;
    const cleaned = mobileNumber.replace(/\s/g, '');
    if (!/^\+?[6-9][0-9]{9,12}$/.test(cleaned)) {
      setMobileError('Enter a valid 10-digit mobile number.');
      return;
    }
    setIsVoting(true);
    setMobileError('');
    try {
      await submitPendingVote([team.id], cleaned);
      setShowMobileDialog(false);
      setVoteStatus('pending');
      toast({ title: '⏳ Vote submitted for verification', description: 'Show your phone to the admin at the voter desk.' });
    } catch (err: any) {
      setMobileError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setIsVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-[#6B5B55]">
        <p>Team not found.</p>
        <Link href="/teams">
          <Button variant="outline" className="border-[#D6C7B4] text-[#4A2C24]">
            Back to Teams
          </Button>
        </Link>
      </div>
    );
  }

  const members = team.team_members
    ? team.team_members.split(',').map((m) => m.trim()).filter(Boolean)
    : [];
  const displayName = team.team_name || `Team #${team.team_number || team.id}`;
  const images: string[] = team.stall_images && team.stall_images.length > 0
    ? team.stall_images
    : team.image_url ? [team.image_url] : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Back */}
        <Link
          href="/teams"
          className="inline-flex items-center gap-2 text-[#6B5B55] hover:text-[#3B2A25] mb-8 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Teams
        </Link>

        {/* Stall image gallery */}
        {images.length > 0 && (
          <div className="bg-[#FFF9F2] rounded-2xl border border-[#D6C7B4] overflow-hidden mb-6">
            <div className="relative" style={{ aspectRatio: '16/7' }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={imgIdx}
                  src={images[imgIdx]}
                  alt={`${displayName} stall`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.42)' }}
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.42)' }}
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className="w-2 h-2 rounded-full"
                        style={{ background: i === imgIdx ? '#F59E0B' : 'rgba(255,255,255,0.55)' }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className="shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2"
                    style={{ borderColor: i === imgIdx ? '#F59E0B' : 'transparent' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Hero card */}
        <div className="bg-[#FFF9F2] rounded-2xl border border-[#D6C7B4] p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-16 h-16 bg-linear-to-br from-[#F59E0B] to-[#D97706] rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-[#F59E0B]/20">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="grow min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className="border-[#D6C7B4] text-[#6B5B55] font-mono text-xs">
                  Team #{team.team_number || team.id}
                </Badge>
              </div>
              <h1 className="text-3xl font-extrabold text-[#3B2A25] leading-tight">{displayName}</h1>
            </div>
            <div className="shrink-0 bg-[#E8DCCB] border border-[#D6C7B4] rounded-xl px-5 py-3 text-center">
              <p className="text-3xl font-bold text-[#3B2A25] leading-none">{team.vote_count}</p>
              <p className="text-[#6B5B55] text-xs mt-1 flex items-center gap-1 justify-center">
                <ThumbsUp className="w-3 h-3" /> votes
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#FFF9F2] rounded-2xl border border-[#D6C7B4] p-8 mb-6">
          <h2 className="text-lg font-bold text-[#3B2A25] mb-4">Project Description</h2>
          <p className="text-[#6B5B55] leading-relaxed text-base">{team.description}</p>
        </div>

        {/* Team members */}
        {members.length > 0 && (
          <div className="bg-[#FFF9F2] rounded-2xl border border-[#D6C7B4] p-8 mb-6">
            <h2 className="text-lg font-bold text-[#3B2A25] mb-4">Team Members</h2>
            <div className="flex flex-wrap gap-3">
              {members.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2 bg-[#E8DCCB] border border-[#D6C7B4] rounded-lg px-3 py-2"
                >
                  <div className="w-7 h-7 bg-linear-to-br from-[#F59E0B] to-[#D97706] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {member.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[#6B5B55] text-sm">{member}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Demo video */}
        {team.demo_video_url && (
          <div className="bg-[#FFF9F2] rounded-2xl border border-[#D6C7B4] p-8 mb-6">
            <h2 className="text-lg font-bold text-[#3B2A25] mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-[#F59E0B]" />
              Demo Video
            </h2>
            <div className="aspect-video rounded-xl overflow-hidden bg-[#E8DCCB]">
              <iframe src={team.demo_video_url} className="w-full h-full" allowFullScreen />
            </div>
          </div>
        )}

        {/* Vote CTA */}
        {voteStatus === 'approved' || hasVoted ? (
          <div className="w-full bg-[#FFF9F2] border border-[#D6C7B4] rounded-2xl p-5 text-center">
            <p className="text-[#4A2C24] font-semibold">✓ Your vote has been approved</p>
          </div>
        ) : voteStatus === 'pending' ? (
          <div className="w-full bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-5 text-center">
            <p className="text-[#92400E] font-semibold">⏳ Waiting for admin approval at the voter desk</p>
          </div>
        ) : voteStatus === 'denied' ? (
          <div className="flex flex-col gap-3">
            <div className="w-full bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-5 text-center">
              <p className="text-[#991B1B] font-semibold">✗ Vote was denied — you may try again</p>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              size="lg"
              className="w-full h-14 text-base font-bold bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-xl shadow-[#F59E0B]/20 gap-2 transition-all duration-300"
            >
              <ThumbsUp className="w-5 h-5" />
              Vote Again
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setShowModal(true)}
            size="lg"
            className="w-full h-14 text-base font-bold bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-xl shadow-[#F59E0B]/20 gap-2 transition-all duration-300"
          >
            <ThumbsUp className="w-5 h-5" />
            Vote for This Team
          </Button>
        )}
      </motion.div>

      {/* Vote Modal */}
      <VoteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onVote={handleVote}
        onViewDetails={() => setShowModal(false)}
        team={
          team
            ? {
                name: displayName,
                description: team.description,
                team_number: team.team_number || team.id,
                image_url: team.image_url,
                stall_images: team.stall_images,
              }
            : null
        }
        isVoting={isVoting}
        hasVoted={voteSuccess}
      />

      {/* Mobile number dialog */}
      <AnimatePresence>
        {showMobileDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowMobileDialog(false); }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 30 }}
              className="w-full max-w-sm rounded-2xl p-6 bg-white"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-amber-100">
                  <Phone className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-bold text-[#3B2A25]" style={{ fontSize: '1rem' }}>Enter your mobile number</h2>
                  <p className="text-xs mt-0.5 text-[#6B5B55]">The admin will verify this at the voter desk</p>
                </div>
              </div>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="e.g. 9876543210"
                value={mobileNumber}
                onChange={(e) => { setMobileNumber(e.target.value.replace(/[^\d+\s]/g, '')); setMobileError(''); }}
                className="w-full px-4 py-3 rounded-xl text-base font-mono outline-none mb-1 border"
                style={{ borderColor: mobileError ? '#ef4444' : '#D6C7B4', letterSpacing: '0.06em' }}
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmMobile(); }}
              />
              {mobileError && <p className="text-xs mb-3 text-red-500">{mobileError}</p>}
              <p className="text-xs mb-4 text-[#6B5B55]">Show this number on your phone when the admin asks. Vote is only counted once verified.</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowMobileDialog(false)} disabled={isVoting}
                  style={{ borderColor: '#D6C7B4', color: '#6B5B55' }}>Cancel</Button>
                <Button className="flex-1 font-bold text-white bg-[#F59E0B] hover:bg-[#D97706] border-0"
                  onClick={handleConfirmMobile} disabled={isVoting || !mobileNumber}>
                  {isVoting ? <><Loader className="w-4 h-4 mr-1.5 animate-spin" /> Submitting…</> : 'Submit Vote'}
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
