'use client';

import { useCallback } from 'react';
import { getSocket } from './useSocket';
import { PlayerAction } from '@/types/actions';

export function useGameActions() {
  const emitAction = useCallback((action: PlayerAction): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      const socket = getSocket();
      if (!socket) {
        resolve({ success: false, error: 'Not connected' });
        return;
      }

      socket.emit('game:action', { action }, (response: any) => {
        resolve(response);
      });
    });
  }, []);

  const move = useCallback((targetLocationId: string) => {
    return emitAction({ type: 'move', targetLocationId });
  }, [emitAction]);

  const investigate = useCallback((locationId?: string) => {
    return emitAction({ type: 'investigate', locationId });
  }, [emitAction]);

  const fight = useCallback((enemyInstanceId: string, usingCardId?: string) => {
    return emitAction({ type: 'fight', enemyInstanceId, usingCardId });
  }, [emitAction]);

  const evade = useCallback((enemyInstanceId: string) => {
    return emitAction({ type: 'evade', enemyInstanceId });
  }, [emitAction]);

  const draw = useCallback(() => {
    return emitAction({ type: 'draw' });
  }, [emitAction]);

  const resource = useCallback(() => {
    return emitAction({ type: 'resource' });
  }, [emitAction]);

  const playCard = useCallback((cardInstanceId: string, targetSlot?: string) => {
    return emitAction({ type: 'play_card', cardInstanceId, targetSlot });
  }, [emitAction]);

  const endTurn = useCallback(() => {
    return emitAction({ type: 'end_turn' });
  }, [emitAction]);

  const engage = useCallback((enemyInstanceId: string) => {
    return emitAction({ type: 'engage', enemyInstanceId });
  }, [emitAction]);

  const resign = useCallback(() => {
    return emitAction({ type: 'resign' });
  }, [emitAction]);

  const commitCard = useCallback((cardInstanceId: string) => {
    return emitAction({ type: 'commit_card', cardInstanceId });
  }, [emitAction]);

  const lockInCommits = useCallback(() => {
    return emitAction({ type: 'lock_in_commits' });
  }, [emitAction]);

  const spendClues = useCallback((amount: number) => {
    return emitAction({ type: 'spend_clues', amount });
  }, [emitAction]);

  return {
    emitAction,
    move,
    investigate,
    fight,
    evade,
    draw,
    resource,
    playCard,
    endTurn,
    engage,
    resign,
    commitCard,
    lockInCommits,
    spendClues,
  };
}
