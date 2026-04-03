'use client';

import { useLobbyStore } from '@/stores/lobbyStore';
import { useSocket } from '@/hooks/useSocket';
import { EXPLORERS } from '@/data/explorers';
import { ExplorerDefinition } from '@/types/cards';
import { RoomPlayer } from '@/types/game';

const CLASS_COLORS: Record<string, string> = {
  guardian: 'border-guardian bg-guardian/10 text-blue-300',
  seeker: 'border-seeker bg-seeker/10 text-amber-300',
  mystic: 'border-mystic bg-mystic/10 text-purple-300',
  rogue: 'border-rogue bg-rogue/10 text-emerald-300',
  survivor: 'border-survivor bg-survivor/10 text-red-300',
};

const SKILL_LABELS: Record<string, string> = {
  resolve: 'RES',
  wit: 'WIT',
  might: 'MGT',
  grace: 'GRC',
};

const DIFFICULTY_INFO = {
  easy: { label: 'Easy', desc: 'A gentle stroll through the garden', color: 'text-emerald-400' },
  standard: { label: 'Standard', desc: 'A proper adventure', color: 'text-brass-300' },
  hard: { label: 'Hard', desc: 'The Jabberwock awaits', color: 'text-copper-400' },
  expert: { label: 'Expert', desc: 'Complete and utter madness', color: 'text-red-400' },
};

export function WaitingRoom() {
  const { roomState, myPlayerId } = useLobbyStore();
  const { selectExplorer, setDifficulty, startGame, leaveRoom } = useSocket();

  if (!roomState || !myPlayerId) return null;

  const isHost = roomState.hostId === myPlayerId;
  const myPlayer = roomState.players.find(p => p.playerId === myPlayerId);
  const selectedIds = new Set(
    roomState.players.filter(p => p.selectedExplorerId).map(p => p.selectedExplorerId)
  );
  const allSelected = roomState.players.every(p => p.selectedExplorerId !== null);

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display text-brass-300">Waiting Room</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-parchment-400 text-sm">Room Code:</span>
            <span className="text-2xl font-mono tracking-[0.3em] text-brass-200 bg-ink-800 px-3 py-1 rounded border border-brass-700/50">
              {roomState.roomId}
            </span>
          </div>
        </div>
        <button onClick={leaveRoom} className="btn-copper text-sm">
          Leave Room
        </button>
      </div>

      {/* Players */}
      <section className="panel-parchment mb-6">
        <h2 className="text-lg font-display text-brass-400 mb-3">
          Explorers ({roomState.players.length}/4)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {roomState.players.map((player) => (
            <PlayerSlot
              key={player.playerId}
              player={player}
              isMe={player.playerId === myPlayerId}
              explorer={EXPLORERS.find(e => e.id === player.selectedExplorerId) ?? null}
            />
          ))}
          {Array.from({ length: 4 - roomState.players.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="rounded-lg border border-dashed border-ink-700 p-4 flex items-center justify-center text-ink-600 min-h-[80px]"
            >
              Waiting for player...
            </div>
          ))}
        </div>
      </section>

      {/* Explorer Selection */}
      <section className="panel-parchment mb-6">
        <h2 className="text-lg font-display text-brass-400 mb-3">
          Choose Your Explorer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXPLORERS.map((explorer) => {
            const isSelected = myPlayer?.selectedExplorerId === explorer.id;
            const isTaken = selectedIds.has(explorer.id) && !isSelected;

            return (
              <ExplorerCard
                key={explorer.id}
                explorer={explorer}
                isSelected={isSelected}
                isTaken={isTaken}
                onSelect={() => selectExplorer(explorer.id)}
              />
            );
          })}
        </div>
      </section>

      {/* Difficulty (host only) */}
      {isHost && (
        <section className="panel-parchment mb-6">
          <h2 className="text-lg font-display text-brass-400 mb-3">
            Difficulty
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.entries(DIFFICULTY_INFO) as [string, typeof DIFFICULTY_INFO['easy']][]).map(
              ([key, info]) => (
                <button
                  key={key}
                  onClick={() => setDifficulty(key as any)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    roomState.selectedDifficulty === key
                      ? 'border-brass-400 bg-brass-500/10'
                      : 'border-ink-700 hover:border-ink-500'
                  }`}
                >
                  <div className={`font-display font-bold ${info.color}`}>
                    {info.label}
                  </div>
                  <div className="text-xs text-ink-400 mt-1">{info.desc}</div>
                </button>
              )
            )}
          </div>
        </section>
      )}

      {!isHost && (
        <section className="panel-parchment mb-6">
          <div className="text-center text-parchment-400">
            Difficulty: <span className={DIFFICULTY_INFO[roomState.selectedDifficulty].color + ' font-bold'}>
              {DIFFICULTY_INFO[roomState.selectedDifficulty].label}
            </span>
            <span className="text-ink-500 text-sm ml-2">(Host selects)</span>
          </div>
        </section>
      )}

      {/* Start Game */}
      {isHost && (
        <div className="text-center">
          <button
            onClick={startGame}
            disabled={!allSelected || roomState.players.length < 1}
            className="btn-brass text-xl px-12 py-4"
          >
            Begin the Adventure
          </button>
          {!allSelected && (
            <p className="text-ink-500 text-sm mt-2">
              All explorers must be selected to begin
            </p>
          )}
        </div>
      )}

      {!isHost && (
        <div className="text-center text-parchment-400">
          Waiting for the host to start the game...
        </div>
      )}
    </main>
  );
}

function PlayerSlot({
  player,
  isMe,
  explorer,
}: {
  player: RoomPlayer;
  isMe: boolean;
  explorer: ExplorerDefinition | null;
}) {
  const classColor = explorer ? CLASS_COLORS[explorer.class] : '';

  return (
    <div
      className={`rounded-lg border p-4 transition-all ${
        explorer
          ? `${classColor} border-2`
          : 'border-ink-600 bg-ink-800/50'
      } ${isMe ? 'ring-1 ring-brass-400/30' : ''}`}
    >
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${player.connected ? 'bg-emerald-400' : 'bg-ink-500'}`} />
        <span className="font-display text-sm truncate">
          {player.playerName}
          {isMe && <span className="text-brass-400 ml-1">(You)</span>}
          {player.isHost && <span className="text-brass-500 ml-1">&#9733;</span>}
        </span>
      </div>
      {explorer && (
        <div className="mt-2 text-xs opacity-80">
          {explorer.name} - {explorer.subtitle}
        </div>
      )}
    </div>
  );
}

function ExplorerCard({
  explorer,
  isSelected,
  isTaken,
  onSelect,
}: {
  explorer: ExplorerDefinition;
  isSelected: boolean;
  isTaken: boolean;
  onSelect: () => void;
}) {
  const classColor = CLASS_COLORS[explorer.class] || '';

  return (
    <button
      onClick={onSelect}
      disabled={isTaken}
      className={`w-full text-left rounded-lg border-2 p-4 transition-all ${
        isSelected
          ? `${classColor} ring-2 ring-brass-400/50 shadow-card-glow`
          : isTaken
            ? 'border-ink-700 bg-ink-900/50 opacity-40 cursor-not-allowed'
            : `border-ink-600 bg-ink-800/50 hover:border-ink-400 hover:bg-ink-800`
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-lg text-parchment-200">
            {explorer.name}
          </h3>
          <p className="text-sm text-ink-300 italic">{explorer.subtitle}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded capitalize font-display ${classColor}`}>
          {explorer.class}
        </span>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mt-3">
        {(Object.entries(explorer.skills) as [string, number][]).map(([skill, value]) => (
          <div key={skill} className="text-center">
            <div className="text-xs text-ink-400">{SKILL_LABELS[skill]}</div>
            <div className="text-lg font-bold font-mono text-parchment-300">{value}</div>
          </div>
        ))}
        <div className="border-l border-ink-700 mx-1" />
        <div className="text-center">
          <div className="text-xs text-red-400">VIT</div>
          <div className="text-lg font-bold font-mono text-red-300">{explorer.vitality}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-blue-400">CLR</div>
          <div className="text-lg font-bold font-mono text-blue-300">{explorer.clarity}</div>
        </div>
      </div>

      {/* Ability preview */}
      <p className="text-xs text-ink-400 mt-3 leading-relaxed">
        {explorer.ability.description}
      </p>

      {isTaken && (
        <div className="mt-2 text-xs text-ink-500 italic">Selected by another player</div>
      )}
    </button>
  );
}
