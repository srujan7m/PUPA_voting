'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ThumbsUp, CheckCircle, Loader2, Users } from 'lucide-react';

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVote: () => void;
  onViewDetails: () => void;
  team: {
    name: string;
    description: string;
    team_number?: number;
    image_url?: string;
    stall_images?: string[];
  } | null;
  isVoting?: boolean;
  hasVoted?: boolean;
}

export default function VoteModal({ isOpen, onClose, onVote, team, isVoting, hasVoted }: VoteModalProps) {
  if (!team) return null;

  const primaryImage = (team.stall_images && team.stall_images.length > 0)
    ? team.stall_images[0]
    : team.image_url;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="p-0 overflow-hidden max-w-110 border-0"
        style={{ background: 'var(--cream)', borderRadius: 'var(--r-xl)', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
      >
        <DialogTitle className="sr-only">Vote for {team.name}</DialogTitle>
        <DialogDescription className="sr-only">
          Cast your vote for {team.name} at PUPA Innovation Expo
        </DialogDescription>

        {/* Shimmer strip */}
        <div
          className="h-1.5 w-full"
          style={{
            background: 'linear-gradient(90deg, var(--amber-400), var(--amber-600), var(--amber-400))',
            backgroundSize: '200% 100%',
            animation: 'shimmerStrip 2s linear infinite',
          }}
        />

        <AnimatePresence mode="wait">
          {hasVoted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="px-8 pt-8 pb-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: '#DCFCE7' }}
              >
                <CheckCircle className="w-7 h-7" style={{ color: 'var(--green-500)' }} />
              </motion.div>
              <h2 className="mb-2" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', color: 'var(--stone-900)' }}>
                Vote Recorded!
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--stone-500)' }}>
                Your vote for{' '}
                <span className="font-semibold" style={{ color: 'var(--stone-800)' }}>{team.name}</span>{' '}
                has been successfully recorded. Thank you for participating!
              </p>
              <Button
                onClick={onClose}
                className="w-full h-11 font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))', border: 'none', boxShadow: 'var(--shadow-amber)' }}
              >
                Done
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              {/* Team image */}
              {primaryImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={primaryImage}
                  alt={team.name}
                  className="w-full object-cover"
                  style={{ maxHeight: 200 }}
                />
              ) : (
                <div
                  className="w-full flex items-center justify-center"
                  style={{ height: 120, background: 'var(--stone-100)' }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: 'var(--stone-200)' }}
                  >
                    <Users className="w-6 h-6" style={{ color: 'var(--stone-400)' }} />
                  </div>
                </div>
              )}

              <div className="px-7 pt-5 pb-7">
                <h2 className="mb-0.5" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: 'var(--stone-900)' }}>
                  Cast Your Vote
                </h2>
                <p className="text-[0.82rem] mb-4" style={{ color: 'var(--stone-500)' }}>
                  You can only vote once. Choose wisely!
                </p>

                {/* Team preview */}
                <div
                  className="rounded-2xl px-5 py-4 mb-5"
                  style={{ background: 'var(--amber-50)', border: '1px solid var(--amber-200)' }}
                >
                  {team.team_number && (
                    <p className="text-[0.72rem] font-bold tracking-[0.06em] mb-1" style={{ color: 'var(--amber-600)' }}>
                      TEAM #{team.team_number}
                    </p>
                  )}
                  <p className="font-bold mb-1.5" style={{ color: 'var(--stone-800)', fontSize: '1rem' }}>
                    {team.name}
                  </p>
                  <p className="text-[0.82rem] leading-[1.6]" style={{ color: 'var(--stone-600)' }}>
                    {team.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={onVote}
                    disabled={isVoting}
                    className="flex-1 gap-2 font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))', border: 'none', boxShadow: 'var(--shadow-amber)' }}
                  >
                    {isVoting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
                    {isVoting ? 'Voting…' : 'Vote for This Team'}
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="font-semibold transition-all duration-150 hover:text-amber-600 hover:border-amber-400 hover:bg-(--amber-50)"
                    style={{ borderColor: 'var(--stone-300)', color: 'var(--stone-700)', background: 'transparent' }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
