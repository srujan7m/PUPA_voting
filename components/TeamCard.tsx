'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Users } from 'lucide-react';

export interface Team {
  id: number;
  name: string;
  team_name: string;
  team_number: number;
  description: string;
  vote_count: number;
  image_url?: string;
  stall_images?: string[];
  team_members?: string;
  demo_video_url?: string;
}

interface TeamCardProps {
  team: Team;
  /** Called when the card body is clicked — used to open detail/preview popup */
  onClick?: (team: Team) => void;
  /** IDs of teams the voter has permanently voted for */
  votedTeamIds?: number[];
  /** IDs currently selected (pre-submission) */
  selectedIds?: number[];
  index?: number;
}

export default function TeamCard({ team, onClick, votedTeamIds = [], selectedIds = [], index = 0 }: TeamCardProps) {
  const isVoted = votedTeamIds.includes(team.id);
  const isSelected = selectedIds.includes(team.id);
  const hasVoted = votedTeamIds.length > 0;
  const isDisabled = hasVoted && !isVoted;
  const num = team.team_number || team.id;
  const displayName = team.team_name || `Team #${num}`;
  const primaryImage = (team.stall_images && team.stall_images.length > 0)
    ? team.stall_images[0]
    : team.image_url;

  const active = isVoted || isSelected;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.min(index * 0.006, 0.3), duration: 0.2 }}
      whileHover={isDisabled ? {} : { y: -3, transition: { duration: 0.15 } }}
      style={{ opacity: isDisabled ? 0.45 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
      onClick={() => !isDisabled && onClick?.(team)}
    >
      <div
        className="flex flex-col rounded-2xl overflow-hidden transition-all duration-150 select-none"
        style={{
          background: active ? 'var(--amber-50)' : 'var(--cream-card)',
          border: active
            ? '2px solid var(--amber-400)'
            : '1.5px solid var(--stone-200)',
          boxShadow: active
            ? '0 0 0 3px rgba(245,158,11,0.12), var(--shadow-md)'
            : 'var(--shadow-sm)',
        }}
      >
        {/* Team image or placeholder */}
        <div
          className="w-full aspect-4/3 flex items-center justify-center relative overflow-hidden"
          style={{ background: active ? 'var(--amber-100)' : 'var(--stone-100)' }}
        >
          {primaryImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImage}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: active ? 'var(--amber-200)' : 'var(--stone-200)' }}
            >
              <Users className="w-4 h-4" style={{ color: active ? 'var(--amber-600)' : 'var(--stone-400)' }} />
            </div>
          )}

          {/* Selection / voted badge */}
          {(isSelected || isVoted) && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: 'var(--amber-500)' }}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </motion.div>
          )}
        </div>

        {/* Info strip */}
        <div className="px-2 py-2 text-center">
          <p className="text-[0.62rem] font-bold" style={{ color: 'var(--amber-600)' }}>
            #{num}
          </p>
          <p
            className="text-[0.72rem] font-semibold leading-tight truncate"
            style={{ color: 'var(--stone-800)' }}
            title={displayName}
          >
            {displayName}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
