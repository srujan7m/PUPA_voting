'use client';

import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ThumbsUp, CheckCircle, Loader2 } from 'lucide-react';

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVote: () => void;
  onViewDetails: () => void;
  team: {
    name: string;
    description: string;
    team_number?: number;
  } | null;
  isVoting?: boolean;
  hasVoted?: boolean;
}

export default function VoteModal({
  isOpen,
  onClose,
  onVote,
  onViewDetails,
  team,
  isVoting,
  hasVoted,
}: VoteModalProps) {
  if (!team) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#FFF9F2] border-[#D6C7B4] text-[#3B2A25] max-w-md p-0 overflow-hidden">
        <DialogTitle className="sr-only">Vote for {team.name}</DialogTitle>
        <DialogDescription className="sr-only">
          Cast your vote for {team.name} at PUPA Innovation Expo
        </DialogDescription>

        {/* Gradient header strip */}
        <div className="h-1.5 bg-linear-to-r from-[#F59E0B] via-[#D97706] to-[#4A2C24]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="p-8 space-y-6"
        >
          {hasVoted ? (
            <div className="text-center py-4 space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              >
                <CheckCircle className="w-20 h-20 text-green-400 mx-auto" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-extrabold text-[#3B2A25]">Vote Recorded!</h2>
                <p className="text-[#6B5B55] mt-2 text-sm">
                  Your vote for <span className="text-[#3B2A25] font-semibold">{team.name}</span> has
                  been successfully cast.
                </p>
              </div>
              <Button
                onClick={onClose}
                className="w-full bg-[#4A2C24] hover:bg-[#3B2A25] text-white font-semibold h-11"
              >
                Done
              </Button>
            </div>
          ) : (
            <>
              {/* Icon + Title */}
              <div className="text-center space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 bg-linear-to-br from-[#F59E0B] to-[#D97706] rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-[#F59E0B]/20"
                >
                  <ThumbsUp className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <p className="text-xs font-medium text-[#F59E0B] uppercase tracking-widest mb-1">
                    Team #{team.team_number}
                  </p>
                  <h2 className="text-2xl font-extrabold text-[#3B2A25]">Vote for this Team?</h2>
                </div>
              </div>

              {/* Team preview card */}
              <div className="bg-[#E8DCCB] border border-[#D6C7B4] rounded-xl p-4 space-y-1">
                <h3 className="font-bold text-[#3B2A25] text-base">{team.name}</h3>
                <p className="text-[#6B5B55] text-sm leading-relaxed line-clamp-3">
                  {team.description}
                </p>
              </div>

              <p className="text-xs text-[#7A5A4F] text-center">
                You can only vote once. This action cannot be undone.
              </p>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onViewDetails}
                  className="flex-1 border-[#4A2C24] text-[#4A2C24] hover:bg-[#4A2C24] hover:text-white"
                >
                  See Full Details
                </Button>
                <Button
                  onClick={onVote}
                  disabled={isVoting}
                  className="flex-1 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold gap-2"
                >
                  {isVoting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Voting...
                    </>
                  ) : (
                    'Vote Now'
                  )}
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
