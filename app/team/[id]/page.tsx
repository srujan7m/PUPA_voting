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
import { fetchTeam, fetchVoteStatus, submitVotes } from '@/lib/api';
import { ArrowLeft, Users, ThumbsUp, Video, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [imgIdx, setImgIdx] = useState(0);

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
      .then((res) => { if (res.data.hasVoted) setHasVoted(true); })
      .catch(console.error);
  }, [params.id]);

  const handleVote = async () => {
    if (!team) return;

    setIsVoting(true);
    try {
      await submitVotes([team.id]);
      setHasVoted(true);
      setVoteSuccess(true);
      toast({ title: '🎉 Vote recorded!', description: 'Your vote has been successfully cast.' });
    } catch (err: any) {
      toast({
        title: 'Unable to vote',
        description: err.response?.data?.error || 'You have already voted.',
        variant: 'destructive',
      });
      setShowModal(false);
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
        {hasVoted ? (
          <div className="w-full bg-[#FFF9F2] border border-[#D6C7B4] rounded-2xl p-5 text-center">
            <p className="text-[#4A2C24] font-semibold">✓ You have already cast your vote</p>
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

      <Toaster />
    </div>
  );
}
