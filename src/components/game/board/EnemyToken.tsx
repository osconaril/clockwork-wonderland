'use client';

export function EnemyToken({ name, damage, health }: { name: string; damage: number; health: number }) {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-900/50 border border-red-700/50 text-xs">
      <span className="text-red-300 font-display">{name}</span>
      <span className="text-red-400 font-mono">{damage}/{health}</span>
    </div>
  );
}
