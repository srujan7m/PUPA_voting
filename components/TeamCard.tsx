'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export interface Team {
  id: number;
  name: string;
  team_name: string;
  team_number: number;
  description: string;
  vote_count: number;
}

interface TeamCardProps {
  team: Team;
  onVote?: (teamId: number) => void;
  hasVoted?: boolean;
  votedTeamId?: number | null;
  index?: number;
}

export default function TeamCard({
  team,
  onVote,
  hasVoted,
  votedTeamId,
  index = 0,
}: TeamCardProps) {
  const isVotedThis = votedTeamId === team.id;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.min(index * 0.01, 0.5), duration: 0.25 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="h-full"
    >
      <Card
        className={`h-full bg-[#FFF9F2] border transition-all duration-200 ${
          isVotedThis
            ? 'border-[#F59E0B] shadow-md shadow-[#F59E0B]/20'
            : 'border-[#D6C7B4] hover:border-[#7A5A4F] hover:shadow-md'
        }`}
      >
        <CardContent className="p-3 flex flex-col items-center gap-2">
          {/* Team number */}
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold text-[#3B2A25]">
              #{team.team_number || team.id}
            </span>
            {isVotedThis && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <CheckCircle2 className="w-4 h-4 text-[#F59E0B]" />
              </motion.div>
            )}
          </div>

          {/* Vote button */}
          {onVote && (
            <Button
              size="sm"
              onClick={() => onVote(team.id)}
              disabled={hasVoted}
              className={`w-full text-xs font-semibold transition-all ${
                isVotedThis
                  ? 'bg-[#F59E0B] text-white cursor-default'
                  : hasVoted
                  ? 'bg-[#D6C7B4] text-[#7A5A4F] cursor-not-allowed'
                  : 'bg-[#F59E0B] hover:bg-[#D97706] text-white'
              }`}
            >
              {isVotedThis ? '✓ Voted' : hasVoted ? 'Voted' : 'Vote'}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
