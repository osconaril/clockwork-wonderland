'use client';

import { ClientPlayerState } from '@/types/socket';

const SKILL_LABELS = { resolve: 'RES', wit: 'WIT', might: 'MGT', grace: 'GRC' };
const SKILL_COLORS = {
  resolve: 'text-purple-300',
  wit: 'text-amber-300',
  might: 'text-red-300',
  grace: 'text-emerald-300',
};

export function ExplorerCard({ player }: { player: ClientPlayerState }) {
  const vitalityPercent = Math.max(0, (player.maxVitality - player.currentDamage) / player.maxVitality * 100);
  const clarityPercent = Math.max(0, (player.maxClarity - player.currentHorror) / player.maxClarity * 100);

  return (
    <div className="w-36 shrink-0 rounded-lg border border-brass-700/50 bg-ink-800/80 p-2">
      <div className="font-display text-xs text-brass-300 font-bold truncate">{player.playerName}</div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-1 mt-1">
        {(Object.entries(player.skills) as [string, number][]).map(([skill, value]) => (
          <div key={skill} className="text-center">
            <div className="text-[8px] text-ink-400">{SKILL_LABELS[skill as keyof typeof SKILL_LABELS]}</div>
            <div className={`text-sm font-bold font-mono ${SKILL_COLORS[skill as keyof typeof SKILL_COLORS]}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Vitality bar */}
      <div className="mt-1.5">
        <div className="flex justify-between text-[8px]">
          <span className="text-red-400">VIT</span>
          <span className="text-red-300">{player.maxVitality - player.currentDamage}/{player.maxVitality}</span>
        </div>
        <div className="h-1.5 bg-ink-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all"
            style={{ width: `${vitalityPercent}%` }}
          />
        </div>
      </div>

      {/* Clarity bar */}
      <div className="mt-1">
        <div className="flex justify-between text-[8px]">
          <span className="text-blue-400">CLR</span>
          <span className="text-blue-300">{player.maxClarity - player.currentHorror}/{player.maxClarity}</span>
        </div>
        <div className="h-1.5 bg-ink-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all"
            style={{ width: `${clarityPercent}%` }}
          />
        </div>
      </div>

      {/* Resources & Clues */}
      <div className="flex justify-between mt-1.5 text-xs">
        <div className="flex items-center gap-1" title="Gears (resources)">
          <span className="text-brass-400">⚙</span>
          <span className="font-mono text-brass-300">{player.resources}</span>
        </div>
        <div className="flex items-center gap-1" title="Curiosities (clues)">
          <span className="text-brass-300">✦</span>
          <span className="font-mono text-brass-200">{player.clues}</span>
        </div>
        <div className="flex items-center gap-1" title="Deck size">
          <span className="text-ink-400">📇</span>
          <span className="font-mono text-ink-300">{player.deckSize}</span>
        </div>
      </div>
    </div>
  );
}
