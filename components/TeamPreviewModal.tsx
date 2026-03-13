'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronLeft, ChevronRight, Users, Plus, Minus, ThumbsUp } from 'lucide-react';
import type { Team } from '@/components/TeamCard';

interface TeamPreviewModalProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
  /** Whether the voter has already permanently submitted votes */
  hasVoted: boolean;
  /** IDs the voter permanently voted for */
  votedTeamIds: number[];
  /** IDs currently selected for this submission */
  selectedIds: number[];
  onToggleSelect: (teamId: number) => void;
  maxVotes?: number;
}

export default function TeamPreviewModal({
  team,
  isOpen,
  onClose,
  hasVoted,
  votedTeamIds,
  selectedIds,
  onToggleSelect,
  maxVotes = 1,
}: TeamPreviewModalProps) {
  const [imgIdx, setImgIdx] = useState(0);

  if (!team) return null;

  const images: string[] = [];
  if (team.stall_images && team.stall_images.length > 0) images.push(...team.stall_images);
  else if (team.image_url) images.push(team.image_url);

  const displayName = team.team_name || `Stall #${team.team_number || team.id}`;
  const isVoted = votedTeamIds.includes(team.id);
  const isSelected = selectedIds.includes(team.id);
  const canAddMore = selectedIds.length < maxVotes;

  const members = team.team_members
    ? team.team_members.split(',').map((m) => m.trim()).filter(Boolean)
    : [];

  const prevImg = () => setImgIdx((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setImgIdx((i) => (i + 1) % images.length);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="p-0 overflow-hidden max-w-130 border-0"
        style={{
          background: 'var(--cream)',
          borderRadius: 'var(--r-xl)',
          boxShadow: '0 28px 72px rgba(0,0,0,0.20)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <DialogTitle className="sr-only">Team {displayName} Details</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed information about {displayName} including description and stall images
        </DialogDescription>

        {/* Amber shimmer strip */}
        <div
          className="h-1.5 w-full shrink-0"
          style={{
            background: 'linear-gradient(90deg, var(--amber-400), var(--amber-600), var(--amber-400))',
            backgroundSize: '200% 100%',
            animation: 'shimmerStrip 2s linear infinite',
          }}
        />

        {/* Image carousel */}
        {images.length > 0 ? (
          <div className="relative w-full" style={{ aspectRatio: '16/9', background: 'var(--stone-100)' }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={imgIdx}
                src={images[imgIdx]}
                alt={`${displayName} stall image ${imgIdx + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className="w-1.5 h-1.5 rounded-full transition-colors"
                      style={{ background: i === imgIdx ? 'var(--amber-400)' : 'rgba(255,255,255,0.55)' }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div
            className="w-full flex items-center justify-center"
            style={{ aspectRatio: '16/9', background: 'var(--stone-100)' }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--stone-200)' }}
            >
              <Users className="w-8 h-8" style={{ color: 'var(--stone-400)' }} />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-6 pt-5 pb-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-[0.72rem] font-bold tracking-[0.06em] mb-0.5" style={{ color: 'var(--amber-600)' }}>
                TEAM #{team.team_number || team.id}
              </p>
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '1.45rem',
                  color: 'var(--stone-900)',
                  lineHeight: 1.2,
                }}
              >
                {displayName}
              </h2>
            </div>
            <div
              className="shrink-0 rounded-xl px-4 py-2 text-center"
              style={{ background: 'var(--amber-50)', border: '1px solid var(--amber-200)' }}
            >
              <p className="text-xl font-bold" style={{ color: 'var(--stone-800)' }}>
                {team.vote_count}
              </p>
              <p className="text-[0.65rem]" style={{ color: 'var(--stone-500)' }}>votes</p>
            </div>
          </div>

          {/* Description */}
          {team.description && (
            <div className="mb-4">
              <h3 className="text-[0.78rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: 'var(--stone-500)' }}>
                About the Project
              </h3>
              <p className="text-[0.88rem] leading-relaxed" style={{ color: 'var(--stone-700)' }}>
                {team.description}
              </p>
            </div>
          )}

          {/* Team members */}
          {members.length > 0 && (
            <div className="mb-5">
              <h3 className="text-[0.78rem] font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--stone-500)' }}>
                Team Members
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {members.map((m, i) => (
                  <span
                    key={i}
                    className="text-[0.75rem] font-medium px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--amber-50)', border: '1px solid var(--amber-200)', color: 'var(--amber-700)' }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Vote action */}
          {isVoted ? (
            <div
              className="flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-sm"
              style={{ background: '#DCFCE7', color: 'var(--green-600)' }}
            >
              <CheckCircle className="w-4 h-4" />
              You voted for this team
            </div>
          ) : hasVoted ? (
            <div
              className="flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-sm"
              style={{ background: 'var(--stone-100)', color: 'var(--stone-500)' }}
            >
              Votes already submitted
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => onToggleSelect(team.id)}
                disabled={!isSelected && !canAddMore}
                className="flex-1 gap-2 font-semibold text-sm h-11"
                style={
                  isSelected
                    ? { background: 'var(--amber-50)', color: 'var(--amber-700)', border: '1.5px solid var(--amber-400)' }
                    : { background: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))', color: '#fff', border: 'none', boxShadow: 'var(--shadow-amber)' }
                }
              >
                {isSelected ? (
                  <><Minus className="w-4 h-4" /> Remove from selection</>
                ) : (
                  <><Plus className="w-4 h-4" />
                    {canAddMore
                      ? `Add to vote (${selectedIds.length}/${maxVotes})`
                      : 'Max 1 vote reached'}
                  </>
                )}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="font-semibold text-sm h-11"
                style={{ borderColor: 'var(--stone-300)', color: 'var(--stone-600)', background: 'transparent' }}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
