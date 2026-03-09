'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
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

export default function TeamCard({ team, onVote, hasVoted, votedTeamId, index = 0 }: TeamCardProps) {
  const router = useRouter();
  const isVotedThis = votedTeamId === team.id;
  const isDisabled = hasVoted && !isVotedThis;
  const num = team.team_number || team.id;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.min(index * 0.008, 0.4), duration: 0.22 }}
      whileHover={isDisabled ? {} : { y: -2, transition: { duration: 0.15 } }}
      className="h-full"
      style={{ opacity: isDisabled ? 0.5 : 1, pointerEvents: isDisabled ? 'none' : 'auto' }}
    >
      <div
        onClick={() => router.push(`/team/${team.id}`)}
        className="flex flex-col items-center gap-[0.45rem] py-3 px-2.5 text-center cursor-pointer transition-all duration-150 min-h-[82px] rounded-[16px]"
        style={{
          background: isVotedThis ? 'var(--amber-50)' : 'var(--cream-card)',
          border: isVotedThis
            ? '1.5px solid var(--amber-400)'
            : '1.5px solid var(--stone-200)',
          boxShadow: isVotedThis
            ? '0 0 0 2px rgba(245,158,11,0.15), var(--shadow-md)'
            : 'var(--shadow-sm)',
        }}
      >
        {/* Team number */}
        <div className="flex items-center gap-0.5">
          <span className="text-[0.82rem] font-bold" style={{ color: 'var(--amber-600)' }}>#</span>
          <span className="text-[0.82rem] font-bold" style={{ color: 'var(--stone-800)' }}>{num}</span>
          {isVotedThis && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
              <CheckCircle2 className="w-3 h-3 ml-0.5" style={{ color: 'var(--amber-500)' }} />
            </motion.span>
          )}
        </div>

        {/* Vote button */}
        {onVote && (
          <button
            onClick={(e) => { e.stopPropagation(); if (!hasVoted) onVote(team.id); }}
            disabled={isDisabled}
            className="text-[0.7rem] font-semibold px-2.5 py-[0.22rem] rounded-[6px] transition-all duration-150 whitespace-nowrap"
            style={{
              border: isVotedThis ? '1px solid var(--amber-400)' : '1px solid var(--stone-300)',
              background: isVotedThis ? 'var(--amber-100)' : '#fff',
              color: isVotedThis ? 'var(--amber-600)' : 'var(--stone-600)',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isVotedThis && !isDisabled) {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--amber-400)';
                (e.currentTarget as HTMLElement).style.color = 'var(--amber-600)';
                (e.currentTarget as HTMLElement).style.background = 'var(--amber-50)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isVotedThis && !isDisabled) {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--stone-300)';
                (e.currentTarget as HTMLElement).style.color = 'var(--stone-600)';
                (e.currentTarget as HTMLElement).style.background = '#fff';
              }
            }}
          >
            {isVotedThis ? '✓ Voted' : 'Vote'}
          </button>
        )}
      </div>
    </motion.div>
  );
}
