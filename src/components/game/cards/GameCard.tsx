'use client';

import { useState } from 'react';
import { CardInstance } from '@/types/game';
import { CARD_DATA, CardInfo } from './cardData';
import { CardArt } from './CardArt';

const CLASS_COLORS: Record<string, { border: string; bg: string; accent: string; glow: string }> = {
  guardian: { border: 'border-blue-500', bg: 'from-blue-950 to-blue-900/80', accent: 'text-blue-300', glow: 'shadow-blue-500/20' },
  seeker:   { border: 'border-amber-500', bg: 'from-amber-950 to-amber-900/80', accent: 'text-amber-300', glow: 'shadow-amber-500/20' },
  mystic:   { border: 'border-purple-500', bg: 'from-purple-950 to-purple-900/80', accent: 'text-purple-300', glow: 'shadow-purple-500/20' },
  rogue:    { border: 'border-emerald-500', bg: 'from-emerald-950 to-emerald-900/80', accent: 'text-emerald-300', glow: 'shadow-emerald-500/20' },
  survivor: { border: 'border-red-500', bg: 'from-red-950 to-red-900/80', accent: 'text-red-300', glow: 'shadow-red-500/20' },
  neutral:  { border: 'border-parchment-500', bg: 'from-ink-900 to-ink-800', accent: 'text-parchment-300', glow: 'shadow-brass-500/20' },
};

const TYPE_BADGE: Record<string, { label: string; color: string }> = {
  asset: { label: 'Asset', color: 'bg-brass-700/60 text-brass-200' },
  event: { label: 'Event', color: 'bg-purple-800/60 text-purple-200' },
  skill: { label: 'Skill', color: 'bg-ink-600/60 text-parchment-300' },
};

interface GameCardProps {
  card: CardInstance;
  size?: 'hand' | 'play' | 'detail';
  interactive?: boolean;
  onClick?: () => void;
  onRightClick?: () => void;
}

export function GameCard({ card, size = 'hand', interactive = false, onClick, onRightClick }: GameCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const info = CARD_DATA[card.definitionId];

  if (!info) {
    return (
      <div className="w-28 h-40 rounded-lg border border-ink-600 bg-ink-800 flex items-center justify-center text-xs text-ink-500">
        {card.definitionId}
      </div>
    );
  }

  const colors = CLASS_COLORS[info.class] || CLASS_COLORS.neutral;
  const typeBadge = TYPE_BADGE[info.type] || TYPE_BADGE.asset;

  const sizeStyles = {
    hand: 'w-[120px] h-[172px]',
    play: 'w-[100px] h-[140px]',
    detail: 'w-[280px] h-[400px]',
  };

  const isDetail = size === 'detail';
  const isPlay = size === 'play';

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    setShowDetail(true);
  }

  return (
    <>
      <div
        className={`${sizeStyles[size]} rounded-lg border-2 ${colors.border} overflow-hidden
          bg-gradient-to-b ${colors.bg}
          shadow-lg ${colors.glow}
          ${interactive ? 'cursor-pointer hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1' : ''}
          ${card.exhausted ? 'rotate-90 opacity-60 scale-90' : ''}
          transition-all duration-200 relative flex flex-col select-none
        `}
        onClick={interactive ? onClick : undefined}
        onContextMenu={handleContextMenu}
      >
        {/* === Header: Cost + Name + Type === */}
        <div className="flex items-start gap-1 px-1.5 pt-1.5 pb-0.5 shrink-0">
          {/* Cost circle */}
          {info.cost !== undefined && (
            <div className={`w-6 h-6 shrink-0 rounded-full bg-ink-950/80 border ${colors.border}
              flex items-center justify-center text-xs font-bold text-brass-200 shadow-inner`}>
              {info.cost}
            </div>
          )}
          {info.cost === undefined && <div className="w-1" />}
          <div className="flex-1 min-w-0">
            <div className={`font-display font-bold leading-tight truncate ${isDetail ? 'text-base' : 'text-[10px]'} ${colors.accent}`}>
              {info.name}
            </div>
            {!isPlay && (
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`text-[7px] px-1 py-0 rounded ${typeBadge.color}`}>
                  {typeBadge.label}
                </span>
                {info.slot && (
                  <span className="text-[7px] text-ink-400">{info.slot}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* === Art Area === */}
        <div className={`mx-1.5 rounded border border-white/5 bg-ink-950/40 overflow-hidden flex items-center justify-center
          ${isDetail ? 'h-40 my-2 mx-3' : isPlay ? 'h-12 my-0.5' : 'h-16 my-0.5'}`}>
          <CardArt
            artKey={info.art}
            className={`${isDetail ? 'w-full h-full' : 'w-full h-full'} ${colors.accent} opacity-70`}
          />
        </div>

        {/* === Traits line === */}
        {!isPlay && (
          <div className={`px-2 ${isDetail ? 'text-[10px]' : 'text-[7px]'} text-ink-400 italic text-center`}>
            {info.traits.join(' · ')}
          </div>
        )}

        {/* === Ability Text === */}
        <div className={`flex-1 px-2 ${isDetail ? 'py-2 text-xs' : 'py-0.5 text-[7px]'} text-parchment-300 leading-relaxed overflow-hidden`}>
          {isDetail ? (
            <p className="whitespace-pre-line">{info.ability}</p>
          ) : (
            <p className="line-clamp-2">{info.ability}</p>
          )}
        </div>

        {/* === Flavor Text (detail & hand) === */}
        {!isPlay && (
          <div className={`px-2 pb-1 ${isDetail ? 'text-[10px]' : 'text-[6px]'} text-ink-400 italic leading-relaxed overflow-hidden`}>
            <p className={isDetail ? '' : 'line-clamp-2'}>{info.flavor}</p>
          </div>
        )}

        {/* === Bottom Bar: Skill Icons + Soak === */}
        <div className={`flex items-center justify-between px-2 pb-1.5 pt-0.5 border-t border-white/5 shrink-0
          ${isDetail ? 'text-xs' : 'text-[8px]'}`}>
          <div className="flex gap-1">
            <SkillIconBadges icons={info.skillIcons} size={isDetail ? 'md' : 'sm'} />
          </div>
          <div className="flex gap-1.5">
            {info.vitality && (
              <span className="text-red-400" title="Vitality soak">♥{info.vitality}</span>
            )}
            {info.clarity && (
              <span className="text-blue-400" title="Clarity soak">◈{info.clarity}</span>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowDetail(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <GameCard card={card} size="detail" />
            <p className="text-center text-ink-400 text-xs mt-2">Click outside to close</p>
          </div>
        </div>
      )}
    </>
  );
}

function SkillIconBadges({ icons, size = 'sm' }: { icons: string; size?: 'sm' | 'md' }) {
  const parts = icons.split(' ');
  const sizeClass = size === 'md' ? 'px-1.5 py-0.5 text-[10px]' : 'px-1 py-0 text-[7px]';

  const ICON_COLORS: Record<string, string> = {
    RES: 'bg-purple-800/50 text-purple-300 border-purple-600/30',
    WIT: 'bg-amber-800/50 text-amber-300 border-amber-600/30',
    MGT: 'bg-red-800/50 text-red-300 border-red-600/30',
    GRC: 'bg-emerald-800/50 text-emerald-300 border-emerald-600/30',
    WILD: 'bg-brass-800/50 text-brass-200 border-brass-600/30',
  };

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('x')) return null;
        const color = ICON_COLORS[part] || ICON_COLORS.WILD;
        const count = parts[i + 1]?.startsWith('x') ? parts[i + 1] : null;
        return (
          <span key={i} className={`${sizeClass} rounded border ${color} font-mono`}>
            {part}{count ? ` ${count}` : ''}
          </span>
        );
      })}
    </>
  );
}
