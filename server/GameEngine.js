// ============================================================
// GAME ENGINE - Authoritative server-side game state machine
// ============================================================

const { v4: uuidv4 } = require('uuid');

// Import scenario + card data (these are .ts files, so we need the compiled versions)
// For now, we inline the data references and use definition IDs

class GameEngine {
  constructor(roomState, scenarioData, cardDefinitions) {
    this.roomId = roomState.roomId;
    this.playerCount = roomState.players.length;
    this.scenarioData = scenarioData;
    this.cardDefinitions = cardDefinitions; // Map of id -> definition
    this.state = null;
    this.io = null;

    this.initializeGameState(roomState);
  }

  setIO(io) {
    this.io = io;
  }

  initializeGameState(roomState) {
    const playerOrder = roomState.players.map(p => p.playerId);
    const cardInstances = {};

    // Build player states
    const players = {};
    for (const rp of roomState.players) {
      const explorerDef = this.cardDefinitions.explorers[rp.selectedExplorerId];
      if (!explorerDef) continue;

      // Create deck card instances
      const deckDef = this.cardDefinitions.starterDecks[rp.selectedExplorerId] || [];
      const deckCards = [];
      for (const cardId of deckDef) {
        const instance = this.createCardInstance(cardId, rp.playerId, 'deck');
        cardInstances[instance.instanceId] = instance;
        deckCards.push(instance.instanceId);
      }

      // Shuffle deck
      this.shuffleArray(deckCards);

      // Draw initial hand of 5
      const hand = deckCards.splice(0, 5);
      hand.forEach(id => { cardInstances[id].zone = 'hand'; });

      players[rp.playerId] = {
        playerId: rp.playerId,
        playerName: rp.playerName,
        explorerId: rp.selectedExplorerId,
        connected: true,
        disconnectedAt: null,
        skills: { ...explorerDef.skills },
        maxVitality: explorerDef.vitality,
        maxClarity: explorerDef.clarity,
        currentDamage: 0,
        currentHorror: 0,
        resources: 5, // Start with 5 Gears
        clues: 0,
        deck: deckCards,
        hand: hand,
        discard: [],
        playArea: [],
        threatArea: [],
        slots: {
          hand: [null, null],
          arcane: [null, null],
          body: null,
          ally: null,
          accessory: null,
        },
        actionsRemaining: 3,
        hasResigned: false,
        isDefeated: false,
        isEliminated: false,
        physicalTrauma: 0,
        mentalTrauma: 0,
        experience: 0,
      };
    }

    // Initialize locations
    const locations = {};
    const locationOrder = [];
    const scenario = this.scenarioData;
    const positionMap = this.calculateLocationPositions(scenario.locations);

    for (const locDef of scenario.locations) {
      const instanceId = locDef.id;
      const isStart = locDef.id === 'loc_clocktower_square';

      locations[instanceId] = {
        definitionId: locDef.id,
        instanceId: instanceId,
        revealed: isStart,
        clues: isStart ? this.scalePerPlayer(locDef.cluesBase, locDef.cluesPerPlayer) : 0,
        doom: 0,
        enemies: [],
        investigators: isStart ? [...playerOrder] : [],
        position: positionMap[locDef.id] || { x: 0, y: 0 },
      };
      locationOrder.push(instanceId);
    }

    // Build encounter deck
    const encounterDeck = [];
    const encounterCards = this.cardDefinitions.encounterCards || [];
    // Add 2 copies of each non-unique, 1 of each unique
    for (const def of encounterCards) {
      const copies = def.isUnique ? 1 : 2;
      for (let i = 0; i < copies; i++) {
        const instance = this.createCardInstance(def.id, 'encounter', 'deck');
        cardInstances[instance.instanceId] = instance;
        encounterDeck.push(instance.instanceId);
      }
    }
    this.shuffleArray(encounterDeck);

    // Set up chaos tokens based on difficulty
    const chaosTokens = [...(scenario.difficulty[roomState.selectedDifficulty] || scenario.difficulty.standard)];

    // Agenda / Act
    const agenda = {
      currentIndex: 0,
      totalAgendas: scenario.agendas.length,
      doom: 0,
      thresholdBase: scenario.agendas[0].doomThreshold,
      perPlayer: scenario.agendas[0].perPlayer,
    };

    const act = {
      currentIndex: 0,
      totalActs: scenario.acts.length,
      clueThresholdBase: scenario.acts[0].clueThreshold,
      perPlayer: scenario.acts[0].perPlayer,
    };

    this.state = {
      roomId: this.roomId,
      scenarioId: scenario.id,
      difficulty: roomState.selectedDifficulty,
      phase: 'explorer', // Skip mythos on round 1
      round: 1,
      leadInvestigatorIndex: 0,
      activePlayerIndex: 0,
      turnOrder: playerOrder,
      players,
      playerOrder,
      cardInstances,
      locations,
      locationOrder,
      enemies: {},
      agenda,
      act,
      encounterDeck,
      encounterDiscard: [],
      chaosTokens,
      victoryDisplay: [],
      skillTest: null,
      pendingDamageAssignment: null,
      pendingHandDiscard: null,
      log: [],
      scenarioEnded: false,
      resolution: null,
      earnedExperience: 0,
    };

    this.addLog('system', `The Clockwork Conspiracy begins. Round 1.`);
    this.addLog('phase', `Explorer Phase - ${players[playerOrder[0]].playerName}'s turn.`);
  }

  createCardInstance(definitionId, ownerId, zone) {
    return {
      instanceId: 'card_' + Math.random().toString(36).substring(2, 10),
      definitionId,
      ownerId,
      zone,
      exhausted: false,
      damage: 0,
      horror: 0,
      attachments: [],
      counters: {},
      faceUp: zone !== 'deck',
    };
  }

  calculateLocationPositions(locationDefs) {
    // Simple layout: clocktower center, others around it
    const positions = {
      'loc_clocktower_square': { x: 400, y: 200 },
      'loc_steam_market': { x: 650, y: 100 },
      'loc_clockwork_garden': { x: 150, y: 100 },
      'loc_hatters_workshop': { x: 650, y: 300 },
      'loc_mad_teahouse': { x: 150, y: 300 },
      'loc_gear_undercity': { x: 400, y: 400 },
    };
    return positions;
  }

  scalePerPlayer(base, perPlayer) {
    return perPlayer ? base * this.playerCount : base;
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // ---- Actions ----

  processAction(playerId, action) {
    if (this.state.scenarioEnded) {
      return { success: false, error: 'Scenario has ended' };
    }

    const player = this.state.players[playerId];
    if (!player) return { success: false, error: 'Player not found' };

    // Check if it's this player's turn (during explorer phase)
    if (this.state.phase === 'explorer') {
      const activeId = this.state.playerOrder[this.state.activePlayerIndex];
      if (playerId !== activeId && !['commit_card', 'lock_in_commits'].includes(action.type)) {
        return { success: false, error: 'Not your turn' };
      }
    }

    switch (action.type) {
      case 'move': return this.handleMove(player, action);
      case 'investigate': return this.handleInvestigate(player, action);
      case 'draw': return this.handleDraw(player);
      case 'resource': return this.handleResource(player);
      case 'fight': return this.handleFight(player, action);
      case 'evade': return this.handleEvade(player, action);
      case 'play_card': return this.handlePlayCard(player, action);
      case 'end_turn': return this.handleEndTurn(player);
      case 'commit_card': return this.handleCommitCard(player, action);
      case 'lock_in_commits': return this.handleLockInCommits(player);
      case 'assign_damage': return this.handleAssignDamage(player, action);
      case 'spend_clues': return this.handleSpendClues(player, action);
      case 'engage': return this.handleEngage(player, action);
      case 'resign': return this.handleResign(player);
      default:
        return { success: false, error: `Unknown action: ${action.type}` };
    }
  }

  consumeAction(player) {
    if (player.actionsRemaining <= 0) return false;
    player.actionsRemaining--;
    return true;
  }

  // Check attacks of opportunity
  checkAttacksOfOpportunity(player, actionType) {
    const exemptActions = ['fight', 'evade', 'resign'];
    if (exemptActions.includes(actionType)) return;

    // Check for ready enemies in threat area
    for (const enemyId of player.threatArea) {
      const enemy = this.state.enemies[enemyId];
      if (enemy && !enemy.exhausted) {
        const def = this.getEnemyDef(enemy.definitionId);
        if (def) {
          this.addLog('enemy', `${def.name} makes an attack of opportunity against ${player.playerName}!`);
          this.dealDamageToPlayer(player.playerId, def.damageValue, def.horrorValue, false, `Attack of opportunity from ${def.name}`);
        }
      }
    }
  }

  handleMove(player, action) {
    if (player.actionsRemaining <= 0) return { success: false, error: 'No actions remaining' };

    const targetLocId = action.targetLocationId;
    const currentLocId = this.getPlayerLocation(player.playerId);
    if (!currentLocId) return { success: false, error: 'Player has no location' };

    // Check connection
    if (!this.areLocationsConnected(currentLocId, targetLocId)) {
      return { success: false, error: 'Locations are not connected' };
    }

    this.checkAttacksOfOpportunity(player, 'move');
    this.consumeAction(player);

    // Remove from current location
    const currentLoc = this.state.locations[currentLocId];
    currentLoc.investigators = currentLoc.investigators.filter(id => id !== player.playerId);

    // Move engaged enemies with player
    // (Enemies in threat area travel with the investigator)

    // Add to target location
    const targetLoc = this.state.locations[targetLocId];
    targetLoc.investigators.push(player.playerId);

    // Reveal location if unrevealed
    if (!targetLoc.revealed) {
      this.revealLocation(targetLocId);
    }

    this.addLog('action', `${player.playerName} moves to ${this.getLocationName(targetLocId)}.`);

    // Auto-engage: check for ready unengaged enemies at new location
    this.checkAutoEngage(targetLocId);

    this.broadcastState();
    return { success: true };
  }

  handleInvestigate(player, action) {
    if (player.actionsRemaining <= 0) return { success: false, error: 'No actions remaining' };

    const locId = this.getPlayerLocation(player.playerId);
    if (!locId) return { success: false, error: 'No location' };

    const loc = this.state.locations[locId];
    if (!loc.revealed) return { success: false, error: 'Location not revealed' };

    const locDef = this.scenarioData.locations.find(l => l.id === loc.definitionId);
    if (!locDef) return { success: false, error: 'Location definition not found' };

    this.checkAttacksOfOpportunity(player, 'investigate');
    this.consumeAction(player);

    // Initiate skill test: Wit vs Shroud
    this.startSkillTest(player.playerId, 'wit', locDef.shroud, {
      type: 'investigate',
      targetId: locId,
    });

    return { success: true };
  }

  handleFight(player, action) {
    if (player.actionsRemaining <= 0) return { success: false, error: 'No actions remaining' };

    const enemyId = action.enemyInstanceId;
    const enemy = this.state.enemies[enemyId];
    if (!enemy) return { success: false, error: 'Enemy not found' };

    const def = this.getEnemyDef(enemy.definitionId);
    if (!def) return { success: false, error: 'Enemy definition not found' };

    // Enemy must be at player's location or engaged with player
    const playerLoc = this.getPlayerLocation(player.playerId);
    if (enemy.locationId !== playerLoc && enemy.engagedWith !== player.playerId) {
      return { success: false, error: 'Enemy not at your location or engaged with you' };
    }

    this.consumeAction(player);

    // Initiate skill test: Might vs Fight
    this.startSkillTest(player.playerId, 'might', def.fightValue, {
      type: 'fight',
      targetId: enemyId,
    });

    return { success: true };
  }

  handleEvade(player, action) {
    if (player.actionsRemaining <= 0) return { success: false, error: 'No actions remaining' };

    const enemyId = action.enemyInstanceId;
    const enemy = this.state.enemies[enemyId];
    if (!enemy) return { success: false, error: 'Enemy not found' };

    if (enemy.engagedWith !== player.playerId) {
      return { success: false, error: 'Enemy not engaged with you' };
    }

    const def = this.getEnemyDef(enemy.definitionId);
    if (!def) return { success: false, error: 'Enemy definition not found' };

    this.consumeAction(player);

    this.startSkillTest(player.playerId, 'grace', def.evadeValue, {
      type: 'evade',
      targetId: enemyId,
    });

    return { success: true };
  }

  handleDraw(player) {
    if (player.actionsRemaining <= 0) return { success: false, error: 'No actions remaining' };
    this.checkAttacksOfOpportunity(player, 'draw');
    this.consumeAction(player);

    this.drawCard(player.playerId);
    this.addLog('action', `${player.playerName} draws a card.`);
    this.broadcastState();
    return { success: true };
  }

  handleResource(player) {
    if (player.actionsRemaining <= 0) return { success: false, error: 'No actions remaining' };
    this.checkAttacksOfOpportunity(player, 'resource');
    this.consumeAction(player);

    player.resources++;
    this.addLog('action', `${player.playerName} gains 1 Gear. (Total: ${player.resources})`);
    this.broadcastState();
    return { success: true };
  }

  handlePlayCard(player, action) {
    if (player.actionsRemaining <= 0) return { success: false, error: 'No actions remaining' };

    const cardId = action.cardInstanceId;
    const cardInstance = this.state.cardInstances[cardId];
    if (!cardInstance) return { success: false, error: 'Card not found' };
    if (cardInstance.ownerId !== player.playerId) return { success: false, error: 'Not your card' };
    if (!player.hand.includes(cardId)) return { success: false, error: 'Card not in hand' };

    const def = this.getCardDef(cardInstance.definitionId);
    if (!def) return { success: false, error: 'Card definition not found' };

    // Check cost
    if (def.cost !== undefined && player.resources < def.cost) {
      return { success: false, error: `Not enough Gears (need ${def.cost}, have ${player.resources})` };
    }

    // Fast cards don't cost an action
    if (!def.fast) {
      this.checkAttacksOfOpportunity(player, 'play_card');
      this.consumeAction(player);
    }

    // Pay cost
    if (def.cost) {
      player.resources -= def.cost;
    }

    // Remove from hand
    player.hand = player.hand.filter(id => id !== cardId);

    if (def.type === 'asset') {
      // Place in play area
      cardInstance.zone = 'play_area';
      player.playArea.push(cardId);

      // Handle slot assignment
      if (def.slot) {
        this.assignSlot(player, cardId, def.slot, def.twoHanded);
      }

      // Initialize counters (ammo, charges, etc.)
      for (const ability of (def.abilities || [])) {
        if (ability.cost?.uses) {
          cardInstance.counters[ability.cost.uses] = ability.cost.usesAmount || 0;
          // Set initial uses from description (parse "Uses (X type)")
          const match = ability.description.match(/Uses?\s*\((\d+)/i);
          if (match) {
            cardInstance.counters[ability.cost.uses] = parseInt(match[1]);
          }
        }
      }

      this.addLog('action', `${player.playerName} plays ${def.name}.`);
    } else if (def.type === 'event') {
      // Resolve effect and discard
      cardInstance.zone = 'discard';
      player.discard.push(cardId);
      this.addLog('action', `${player.playerName} plays ${def.name}.`);
      // TODO: resolve event effects
    }

    this.broadcastState();
    return { success: true };
  }

  handleEndTurn(player) {
    player.actionsRemaining = 0;
    this.addLog('action', `${player.playerName} ends their turn.`);
    this.advanceToNextPlayer();
    return { success: true };
  }

  handleEngage(player, action) {
    if (player.actionsRemaining <= 0) return { success: false, error: 'No actions remaining' };

    const enemyId = action.enemyInstanceId;
    const enemy = this.state.enemies[enemyId];
    if (!enemy) return { success: false, error: 'Enemy not found' };

    const playerLoc = this.getPlayerLocation(player.playerId);
    if (enemy.locationId !== playerLoc) return { success: false, error: 'Enemy not at your location' };

    this.consumeAction(player);

    // Disengage from current player if engaged
    if (enemy.engagedWith) {
      const prevPlayer = this.state.players[enemy.engagedWith];
      if (prevPlayer) {
        prevPlayer.threatArea = prevPlayer.threatArea.filter(id => id !== enemyId);
      }
    }

    enemy.engagedWith = player.playerId;
    if (!player.threatArea.includes(enemyId)) {
      player.threatArea.push(enemyId);
    }

    const def = this.getEnemyDef(enemy.definitionId);
    this.addLog('action', `${player.playerName} engages ${def?.name || 'enemy'}.`);
    this.broadcastState();
    return { success: true };
  }

  handleResign(player) {
    const locId = this.getPlayerLocation(player.playerId);
    // For simplicity, allow resign from any location in this scenario
    player.hasResigned = true;
    player.isEliminated = true;

    // Drop clues at location
    if (locId && player.clues > 0) {
      this.state.locations[locId].clues += player.clues;
      player.clues = 0;
    }

    this.addLog('action', `${player.playerName} resigns from the scenario.`);
    this.checkAllEliminated();
    this.broadcastState();
    return { success: true };
  }

  handleSpendClues(player, action) {
    const amount = action.amount;
    if (player.clues < amount) return { success: false, error: 'Not enough Curiosities' };

    // Check if act can advance
    const act = this.state.act;
    const actDef = this.scenarioData.acts[act.currentIndex];
    const threshold = this.scalePerPlayer(actDef.clueThreshold, actDef.perPlayer);

    // Collect total clues being spent from all players
    // For now, just this player's contribution
    player.clues -= amount;

    this.addLog('action', `${player.playerName} spends ${amount} Curiosit${amount === 1 ? 'y' : 'ies'}.`);

    // Check if enough total clues have been spent (simplified: check if any player
    // triggers the advance by accumulating spent clues)
    // For simplicity: track on the act itself
    if (!this.state._spentClues) this.state._spentClues = 0;
    this.state._spentClues += amount;

    if (this.state._spentClues >= threshold) {
      this.advanceAct();
      this.state._spentClues = 0;
    }

    this.broadcastState();
    return { success: true };
  }

  // ---- Skill Tests ----

  startSkillTest(playerId, skillType, difficulty, context) {
    const player = this.state.players[playerId];
    const baseSkill = player.skills[skillType] || 0;

    this.state.skillTest = {
      testingPlayerId: playerId,
      skillType,
      difficulty,
      baseSkillValue: baseSkill,
      committedCards: [],
      revealedToken: null,
      tokenModifier: 0,
      bonusModifiers: 0,
      modifiedSkillValue: baseSkill,
      success: null,
      step: 'awaiting_commits',
      context,
      commitsLockedIn: [],
    };

    this.addLog('skill_test', `${player.playerName} begins a ${skillType} test (difficulty ${difficulty}).`);

    // Auto-resolve immediately (no commit phase in simplified mode)
    this.resolveSkillTest();
  }

  handleCommitCard(player, action) {
    if (!this.state.skillTest) return { success: false, error: 'No skill test in progress' };

    const cardId = action.cardInstanceId;
    if (!player.hand.includes(cardId)) return { success: false, error: 'Card not in hand' };

    const cardInstance = this.state.cardInstances[cardId];
    const def = this.getCardDef(cardInstance.definitionId);
    if (!def || !def.skillIcons) return { success: false, error: 'Card has no skill icons' };

    // Check if card has matching icons
    const testSkill = this.state.skillTest.skillType;
    const icons = def.skillIcons;
    if (!icons[testSkill] && !icons.wild) return { success: false, error: 'Card has no matching skill icons' };

    this.state.skillTest.committedCards.push({
      cardInstanceId: cardId,
      playerId: player.playerId,
    });

    // Move card to committed zone
    player.hand = player.hand.filter(id => id !== cardId);
    cardInstance.zone = 'committed';

    this.broadcastState();
    return { success: true };
  }

  handleLockInCommits(player) {
    if (!this.state.skillTest) return { success: false, error: 'No skill test' };

    if (!this.state.skillTest.commitsLockedIn.includes(player.playerId)) {
      this.state.skillTest.commitsLockedIn.push(player.playerId);
    }

    // Check if all players locked in
    const allLocked = this.state.playerOrder.every(
      pid => this.state.skillTest.commitsLockedIn.includes(pid)
    );

    if (allLocked) {
      this.resolveSkillTest();
    }

    return { success: true };
  }

  resolveSkillTest() {
    const test = this.state.skillTest;
    if (!test) return;

    // Calculate committed icons bonus
    let commitBonus = 0;
    for (const commit of test.committedCards) {
      const card = this.state.cardInstances[commit.cardInstanceId];
      if (!card) continue;
      const def = this.getCardDef(card.definitionId);
      if (!def?.skillIcons) continue;

      const icons = def.skillIcons;
      commitBonus += icons[test.skillType] || 0;
      commitBonus += icons.wild || 0;
    }

    // Draw chaos token
    test.step = 'revealing_token';
    const tokenIndex = Math.floor(Math.random() * this.state.chaosTokens.length);
    const token = this.state.chaosTokens[tokenIndex];
    test.revealedToken = token;

    // Calculate token modifier
    test.tokenModifier = this.getTokenModifier(token);
    test.step = 'token_revealed';

    // Calculate final value
    test.modifiedSkillValue = test.baseSkillValue + commitBonus + test.tokenModifier + test.bonusModifiers;
    test.step = 'calculating';

    // Determine result
    if (token === 'auto_fail') {
      test.success = false;
    } else {
      test.success = test.modifiedSkillValue >= test.difficulty;
    }
    test.step = 'determining_result';

    const resultText = test.success ? 'SUCCESS' : 'FAILURE';
    this.addLog('skill_test',
      `${test.skillType} test: ${test.modifiedSkillValue} vs ${test.difficulty} = ${resultText} (token: ${this.getTokenName(token)}, commit: +${commitBonus})`
    );

    // Apply result
    test.step = 'applying_result';
    this.applySkillTestResult(test);

    // Cleanup committed cards
    for (const commit of test.committedCards) {
      const card = this.state.cardInstances[commit.cardInstanceId];
      if (card) {
        card.zone = 'discard';
        const owner = this.state.players[commit.playerId];
        if (owner) {
          owner.discard.push(commit.cardInstanceId);
        }
      }
    }

    test.step = 'complete';
    this.state.skillTest = null;
    this.broadcastState();
  }

  applySkillTestResult(test) {
    const player = this.state.players[test.testingPlayerId];
    if (!player) return;

    if (test.context.type === 'investigate' && test.success) {
      const locId = test.context.targetId;
      const loc = this.state.locations[locId];
      if (loc && loc.clues > 0) {
        loc.clues--;
        player.clues++;
        this.addLog('action', `${player.playerName} discovers a Curiosity! (${loc.clues} remaining at location)`);
      }
    } else if (test.context.type === 'fight') {
      const enemyId = test.context.targetId;
      const enemy = this.state.enemies[enemyId];
      if (enemy) {
        const def = this.getEnemyDef(enemy.definitionId);
        if (test.success) {
          enemy.damage += 1; // Base damage
          this.addLog('action', `${player.playerName} hits ${def?.name} for 1 damage! (${enemy.damage}/${def?.healthBase || '?'})`);

          // Check if defeated
          const maxHealth = def?.healthPerPlayer ? (def.healthBase * this.playerCount) : (def?.healthBase || 1);
          if (enemy.damage >= maxHealth) {
            this.defeatEnemy(enemyId);
          }
        } else {
          this.addLog('action', `${player.playerName} misses ${def?.name}!`);
          // Retaliate
          if (def?.keywords?.includes('retaliate')) {
            this.addLog('enemy', `${def.name} retaliates!`);
            this.dealDamageToPlayer(player.playerId, def.damageValue, def.horrorValue, false, `Retaliation from ${def.name}`);
          }
        }
      }
    } else if (test.context.type === 'evade') {
      const enemyId = test.context.targetId;
      const enemy = this.state.enemies[enemyId];
      if (enemy) {
        const def = this.getEnemyDef(enemy.definitionId);
        if (test.success) {
          enemy.exhausted = true;
          enemy.engagedWith = null;
          player.threatArea = player.threatArea.filter(id => id !== enemyId);
          this.addLog('action', `${player.playerName} evades ${def?.name}!`);
        } else {
          this.addLog('action', `${player.playerName} fails to evade ${def?.name}!`);
          if (def?.keywords?.includes('alert')) {
            this.addLog('enemy', `${def.name} is alert and attacks!`);
            this.dealDamageToPlayer(player.playerId, def.damageValue, def.horrorValue, false, `Alert attack from ${def.name}`);
          }
        }
      }
    }
  }

  getTokenModifier(token) {
    const modifiers = {
      'plus_one': 1, 'zero': 0, 'minus_one': -1, 'minus_two': -2,
      'minus_three': -3, 'minus_four': -4, 'minus_five': -5,
      'minus_six': -6, 'minus_seven': -7, 'minus_eight': -8,
      'elder_sign': 1, 'auto_fail': 0,
      'skull': -1, // Variable, simplified
      'cultist': -2, 'tablet': -3, 'elder_thing': -4,
    };
    return modifiers[token] ?? 0;
  }

  getTokenName(token) {
    const names = {
      'plus_one': '+1', 'zero': '0', 'minus_one': '-1', 'minus_two': '-2',
      'minus_three': '-3', 'minus_four': '-4', 'minus_five': '-5',
      'minus_six': '-6', 'minus_seven': '-7', 'minus_eight': '-8',
      'elder_sign': 'Elder Sign', 'auto_fail': 'Auto-Fail',
      'skull': 'Skull', 'cultist': 'Cultist', 'tablet': 'Tablet', 'elder_thing': 'Elder Thing',
    };
    return names[token] || token;
  }

  // ---- Phase Management ----

  advanceToNextPlayer() {
    let nextIndex = this.state.activePlayerIndex + 1;

    // Skip eliminated players
    while (nextIndex < this.state.playerOrder.length) {
      const pid = this.state.playerOrder[nextIndex];
      const p = this.state.players[pid];
      if (!p.isEliminated) break;
      nextIndex++;
    }

    if (nextIndex >= this.state.playerOrder.length) {
      // All players have taken their turns
      this.endExplorerPhase();
    } else {
      this.state.activePlayerIndex = nextIndex;
      const nextPlayer = this.state.players[this.state.playerOrder[nextIndex]];
      nextPlayer.actionsRemaining = 3;
      this.addLog('phase', `${nextPlayer.playerName}'s turn. (${nextPlayer.actionsRemaining} actions)`);
      this.broadcastState();
    }
  }

  endExplorerPhase() {
    this.addLog('phase', 'Explorer Phase ends.');

    // Enemy Phase
    this.state.phase = 'enemy';
    this.addLog('phase', 'Enemy Phase begins.');
    this.runEnemyPhase();

    // Upkeep Phase
    this.state.phase = 'upkeep';
    this.addLog('phase', 'Upkeep Phase begins.');
    this.runUpkeepPhase();

    // New Round
    this.state.round++;
    this.state.leadInvestigatorIndex = (this.state.leadInvestigatorIndex + 1) % this.state.playerOrder.length;

    // Madness Phase (not skipped after round 1)
    this.state.phase = 'madness';
    this.addLog('phase', `Round ${this.state.round} - Madness Phase begins.`);
    this.runMadnessPhase();

    // Back to Explorer Phase
    this.state.phase = 'explorer';
    this.state.activePlayerIndex = this.findFirstActivePlayer();
    const firstPlayer = this.state.players[this.state.playerOrder[this.state.activePlayerIndex]];
    if (firstPlayer) {
      firstPlayer.actionsRemaining = 3;
      this.addLog('phase', `Explorer Phase - ${firstPlayer.playerName}'s turn.`);
    }

    this.broadcastState();
  }

  findFirstActivePlayer() {
    for (let i = 0; i < this.state.playerOrder.length; i++) {
      const idx = (this.state.leadInvestigatorIndex + i) % this.state.playerOrder.length;
      const pid = this.state.playerOrder[idx];
      if (!this.state.players[pid].isEliminated) return idx;
    }
    return 0;
  }

  runMadnessPhase() {
    // 1. Place 1 doom on agenda
    this.state.agenda.doom++;
    this.addLog('phase', `Chaos rises... (${this.state.agenda.doom}/${this.getAgendaThreshold()} on agenda)`);

    // 2. Check doom threshold
    const totalDoom = this.getTotalDoom();
    const threshold = this.getAgendaThreshold();
    if (totalDoom >= threshold) {
      this.advanceAgenda();
    }

    // 3. Draw encounter cards
    for (const pid of this.state.playerOrder) {
      const player = this.state.players[pid];
      if (player.isEliminated) continue;

      if (this.state.encounterDeck.length === 0) {
        // Shuffle discard into deck
        this.state.encounterDeck = [...this.state.encounterDiscard];
        this.state.encounterDiscard = [];
        this.shuffleArray(this.state.encounterDeck);
      }

      if (this.state.encounterDeck.length > 0) {
        const cardId = this.state.encounterDeck.shift();
        const card = this.state.cardInstances[cardId];
        const def = this.getCardDef(card.definitionId) || this.getEnemyDef(card.definitionId) || this.getTreacheryDef(card.definitionId);

        if (def) {
          this.addLog('phase', `${player.playerName} draws: ${def.name}`);

          if (def.type === 'enemy') {
            this.spawnEnemy(card, def, pid);
          } else if (def.type === 'treachery') {
            // Simple treachery resolution
            this.resolveTreachery(card, def, pid);
          }
        }

        this.state.encounterDiscard.push(cardId);
      }
    }
  }

  runEnemyPhase() {
    // Hunter enemies move
    for (const [enemyId, enemy] of Object.entries(this.state.enemies)) {
      if (enemy.exhausted) continue;
      if (enemy.engagedWith) continue; // Already engaged

      const def = this.getEnemyDef(enemy.definitionId);
      if (!def?.keywords?.includes('hunter')) continue;

      // Find nearest investigator and move toward them
      const nearestLoc = this.findNearestInvestigatorLocation(enemy.locationId);
      if (nearestLoc && nearestLoc !== enemy.locationId) {
        const path = this.findPathBetween(enemy.locationId, nearestLoc);
        if (path.length > 1) {
          enemy.locationId = path[1]; // Move one step
          this.state.locations[path[0]].enemies = this.state.locations[path[0]].enemies.filter(id => id !== enemyId);
          if (!this.state.locations[path[1]].enemies.includes(enemyId)) {
            this.state.locations[path[1]].enemies.push(enemyId);
          }
          this.addLog('enemy', `${def.name} hunts toward ${this.getLocationName(path[1])}.`);
          this.checkAutoEngage(path[1]);
        }
      }
    }

    // Engaged enemies attack
    for (const pid of this.state.playerOrder) {
      const player = this.state.players[pid];
      if (player.isEliminated) continue;

      for (const enemyId of [...player.threatArea]) {
        const enemy = this.state.enemies[enemyId];
        if (!enemy || enemy.exhausted) continue;

        const def = this.getEnemyDef(enemy.definitionId);
        if (!def) continue;

        this.addLog('enemy', `${def.name} attacks ${player.playerName}! (${def.damageValue} damage, ${def.horrorValue} horror)`);
        this.dealDamageToPlayer(pid, def.damageValue, def.horrorValue, false, `Attack from ${def.name}`);
        enemy.exhausted = true;
      }
    }
  }

  runUpkeepPhase() {
    // Ready all exhausted cards
    for (const card of Object.values(this.state.cardInstances)) {
      if (card.exhausted) card.exhausted = false;
    }
    for (const enemy of Object.values(this.state.enemies)) {
      if (enemy.exhausted) enemy.exhausted = false;
    }

    // Each player draws 1 card and gains 1 resource
    for (const pid of this.state.playerOrder) {
      const player = this.state.players[pid];
      if (player.isEliminated) continue;

      this.drawCard(pid);
      player.resources++;

      // Hand size check
      if (player.hand.length > 8) {
        // For now, auto-discard excess (in real game, player chooses)
        while (player.hand.length > 8) {
          const discardId = player.hand.pop();
          if (discardId) {
            this.state.cardInstances[discardId].zone = 'discard';
            player.discard.push(discardId);
          }
        }
      }
    }

    this.addLog('phase', 'All cards readied. Each explorer draws 1 card and gains 1 Gear.');

    // Re-engage: ready unengaged enemies at locations with investigators
    for (const [locId, loc] of Object.entries(this.state.locations)) {
      if (loc.investigators.length > 0) {
        this.checkAutoEngage(locId);
      }
    }
  }

  // ---- Enemy Helpers ----

  spawnEnemy(cardInstance, def, drawingPlayerId) {
    const enemyId = 'enemy_' + Math.random().toString(36).substring(2, 10);
    const playerLoc = this.getPlayerLocation(drawingPlayerId);
    const spawnLoc = def.spawn || playerLoc;

    const enemy = {
      instanceId: enemyId,
      definitionId: def.id,
      damage: 0,
      doom: 0,
      exhausted: false,
      engagedWith: null,
      locationId: spawnLoc,
      keywords: def.keywords || [],
    };

    this.state.enemies[enemyId] = enemy;

    if (!this.state.locations[spawnLoc].enemies.includes(enemyId)) {
      this.state.locations[spawnLoc].enemies.push(enemyId);
    }

    // Auto-engage if at same location as an investigator (and not Aloof)
    if (!def.keywords?.includes('aloof')) {
      if (def.spawn) {
        this.checkAutoEngage(spawnLoc);
      } else {
        // Spawns engaged with drawing player
        enemy.engagedWith = drawingPlayerId;
        const player = this.state.players[drawingPlayerId];
        if (player && !player.threatArea.includes(enemyId)) {
          player.threatArea.push(enemyId);
        }
      }
    }
  }

  defeatEnemy(enemyId) {
    const enemy = this.state.enemies[enemyId];
    if (!enemy) return;

    const def = this.getEnemyDef(enemy.definitionId);
    this.addLog('enemy', `${def?.name || 'Enemy'} is defeated!`);

    // Remove from engaged player's threat area
    if (enemy.engagedWith) {
      const player = this.state.players[enemy.engagedWith];
      if (player) {
        player.threatArea = player.threatArea.filter(id => id !== enemyId);
      }
    }

    // Remove from location
    const loc = this.state.locations[enemy.locationId];
    if (loc) {
      loc.enemies = loc.enemies.filter(id => id !== enemyId);
    }

    // Victory display
    if (def?.victoryPoints) {
      this.state.victoryDisplay.push(enemyId);
      this.addLog('system', `${def.name} added to Victory Display (${def.victoryPoints} XP).`);
    }

    delete this.state.enemies[enemyId];
  }

  checkAutoEngage(locationId) {
    const loc = this.state.locations[locationId];
    if (!loc) return;

    for (const enemyId of [...loc.enemies]) {
      const enemy = this.state.enemies[enemyId];
      if (!enemy || enemy.exhausted || enemy.engagedWith) continue;

      const def = this.getEnemyDef(enemy.definitionId);
      if (def?.keywords?.includes('aloof')) continue;

      // Find first investigator at location
      for (const pid of loc.investigators) {
        const player = this.state.players[pid];
        if (player && !player.isEliminated) {
          enemy.engagedWith = pid;
          if (!player.threatArea.includes(enemyId)) {
            player.threatArea.push(enemyId);
          }
          this.addLog('enemy', `${def?.name || 'Enemy'} engages ${player.playerName}!`);
          break;
        }
      }
    }
  }

  resolveTreachery(cardInstance, def, playerId) {
    // Simplified treachery resolution
    const player = this.state.players[playerId];
    if (!player) return;

    if (def.revelation?.type === 'deal_damage') {
      const val = def.revelation.value || 1;
      this.dealDamageToPlayer(playerId, val, 0, false, def.name);
    } else if (def.revelation?.type === 'deal_horror') {
      const val = def.revelation.value || 1;
      this.dealDamageToPlayer(playerId, 0, val, false, def.name);
    } else if (def.revelation?.type === 'place_doom') {
      this.state.agenda.doom += (def.revelation.value || 1);
      this.addLog('phase', `${def.name}: Chaos placed on agenda!`);
    } else if (def.revelation?.type === 'skill_test') {
      // Auto-resolve treachery skill tests (simplified)
      const st = def.revelation.skillTest;
      const skill = player.skills[st.skill] || 0;
      const tokenIdx = Math.floor(Math.random() * this.state.chaosTokens.length);
      const token = this.state.chaosTokens[tokenIdx];
      const mod = this.getTokenModifier(token);
      const total = skill + mod;

      if (total < st.difficulty || token === 'auto_fail') {
        this.addLog('skill_test', `${player.playerName} fails ${st.skill} test from ${def.name} (${total} vs ${st.difficulty}).`);
        if (st.onFailure) {
          if (st.onFailure.type === 'deal_damage') {
            this.dealDamageToPlayer(playerId, st.onFailure.value || 1, 0, false, def.name);
          } else if (st.onFailure.type === 'deal_horror') {
            this.dealDamageToPlayer(playerId, 0, st.onFailure.value || 1, false, def.name);
          }
        }
      } else {
        this.addLog('skill_test', `${player.playerName} passes ${st.skill} test from ${def.name} (${total} vs ${st.difficulty}).`);
      }
    }
  }

  // ---- Damage System ----

  dealDamageToPlayer(playerId, damage, horror, isDirect, source) {
    const player = this.state.players[playerId];
    if (!player) return;

    // Simplified: apply directly to investigator (full soak system comes later)
    player.currentDamage += damage;
    player.currentHorror += horror;

    if (damage > 0) this.addLog('system', `${player.playerName} takes ${damage} damage from ${source}.`);
    if (horror > 0) this.addLog('system', `${player.playerName} takes ${horror} horror from ${source}.`);

    // Check defeat
    if (player.currentDamage >= player.maxVitality) {
      player.isDefeated = true;
      player.isEliminated = true;
      player.physicalTrauma++;
      this.addLog('system', `${player.playerName} has been defeated! (Physical trauma)`);
      this.checkAllEliminated();
    } else if (player.currentHorror >= player.maxClarity) {
      player.isDefeated = true;
      player.isEliminated = true;
      player.mentalTrauma++;
      this.addLog('system', `${player.playerName} has gone mad! (Mental trauma)`);
      this.checkAllEliminated();
    }
  }

  // ---- Card / Deck Helpers ----

  drawCard(playerId) {
    const player = this.state.players[playerId];
    if (!player) return;

    if (player.deck.length === 0) {
      // Shuffle discard into deck
      player.deck = [...player.discard];
      player.discard = [];
      this.shuffleArray(player.deck);
      // Take 1 horror for reshuffling
      player.currentHorror++;
      this.addLog('system', `${player.playerName}'s deck runs out! Discard shuffled back. Takes 1 horror.`);
    }

    if (player.deck.length > 0) {
      const cardId = player.deck.shift();
      player.hand.push(cardId);
      this.state.cardInstances[cardId].zone = 'hand';
    }
  }

  assignSlot(player, cardId, slotType, twoHanded) {
    if (slotType === 'hand') {
      if (twoHanded) {
        // Clear both hand slots
        this.clearSlot(player, 'hand', 0);
        this.clearSlot(player, 'hand', 1);
        player.slots.hand[0] = cardId;
        player.slots.hand[1] = cardId;
      } else {
        if (!player.slots.hand[0]) {
          player.slots.hand[0] = cardId;
        } else if (!player.slots.hand[1]) {
          player.slots.hand[1] = cardId;
        } else {
          // Discard first slot
          this.clearSlot(player, 'hand', 0);
          player.slots.hand[0] = cardId;
        }
      }
    } else if (slotType === 'arcane') {
      if (!player.slots.arcane[0]) {
        player.slots.arcane[0] = cardId;
      } else if (!player.slots.arcane[1]) {
        player.slots.arcane[1] = cardId;
      } else {
        this.clearSlot(player, 'arcane', 0);
        player.slots.arcane[0] = cardId;
      }
    } else {
      // Single slots: body, ally, accessory
      if (player.slots[slotType]) {
        this.clearSlot(player, slotType);
      }
      player.slots[slotType] = cardId;
    }
  }

  clearSlot(player, slotType, index) {
    let cardId;
    if (index !== undefined) {
      cardId = player.slots[slotType][index];
      player.slots[slotType][index] = null;
    } else {
      cardId = player.slots[slotType];
      player.slots[slotType] = null;
    }

    if (cardId) {
      player.playArea = player.playArea.filter(id => id !== cardId);
      this.state.cardInstances[cardId].zone = 'discard';
      player.discard.push(cardId);
    }
  }

  // ---- Location Helpers ----

  getPlayerLocation(playerId) {
    for (const [locId, loc] of Object.entries(this.state.locations)) {
      if (loc.investigators.includes(playerId)) return locId;
    }
    return null;
  }

  areLocationsConnected(locId1, locId2) {
    return this.scenarioData.locationConnections.some(
      ([a, b]) => (a === locId1 && b === locId2) || (a === locId2 && b === locId1)
    );
  }

  revealLocation(locId) {
    const loc = this.state.locations[locId];
    if (!loc || loc.revealed) return;

    const def = this.scenarioData.locations.find(l => l.id === loc.definitionId);
    if (!def) return;

    loc.revealed = true;
    loc.clues = this.scalePerPlayer(def.cluesBase, def.cluesPerPlayer);
    this.addLog('action', `${def.name} revealed! (${loc.clues} Curiosities placed)`);
  }

  getLocationName(locId) {
    const def = this.scenarioData.locations.find(l => l.id === locId);
    return def?.name || locId;
  }

  findNearestInvestigatorLocation(fromLocId) {
    // BFS to find nearest location with an active investigator
    const visited = new Set();
    const queue = [fromLocId];
    visited.add(fromLocId);

    while (queue.length > 0) {
      const current = queue.shift();
      const loc = this.state.locations[current];
      if (loc && loc.investigators.some(pid => !this.state.players[pid]?.isEliminated)) {
        return current;
      }

      // Find connected locations
      for (const [a, b] of this.scenarioData.locationConnections) {
        const neighbor = a === current ? b : b === current ? a : null;
        if (neighbor && !visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return null;
  }

  findPathBetween(from, to) {
    // BFS shortest path
    const visited = new Map();
    const queue = [from];
    visited.set(from, null);

    while (queue.length > 0) {
      const current = queue.shift();
      if (current === to) {
        // Reconstruct path
        const path = [];
        let node = to;
        while (node !== null) {
          path.unshift(node);
          node = visited.get(node);
        }
        return path;
      }

      for (const [a, b] of this.scenarioData.locationConnections) {
        const neighbor = a === current ? b : b === current ? a : null;
        if (neighbor && !visited.has(neighbor)) {
          visited.set(neighbor, current);
          queue.push(neighbor);
        }
      }
    }
    return [from]; // No path found
  }

  // ---- Agenda / Act ----

  getAgendaThreshold() {
    const agenda = this.state.agenda;
    return agenda.perPlayer ? agenda.thresholdBase * this.playerCount : agenda.thresholdBase;
  }

  getTotalDoom() {
    let total = this.state.agenda.doom;
    // Add doom on enemies, locations, etc.
    for (const enemy of Object.values(this.state.enemies)) {
      total += enemy.doom;
    }
    for (const loc of Object.values(this.state.locations)) {
      total += loc.doom;
    }
    return total;
  }

  advanceAgenda() {
    const agenda = this.state.agenda;
    const agendaDef = this.scenarioData.agendas[agenda.currentIndex];

    this.addLog('narrative', `Agenda advances: ${agendaDef.backText}`);

    // Remove all doom
    this.state.agenda.doom = 0;
    for (const enemy of Object.values(this.state.enemies)) {
      enemy.doom = 0;
    }
    for (const loc of Object.values(this.state.locations)) {
      loc.doom = 0;
    }

    // Move to next agenda
    agenda.currentIndex++;
    if (agenda.currentIndex >= agenda.totalAgendas) {
      // Final agenda advanced - scenario ends (bad)
      this.endScenario('resolution_2');
      return;
    }

    const nextAgenda = this.scenarioData.agendas[agenda.currentIndex];
    agenda.thresholdBase = nextAgenda.doomThreshold;
    agenda.perPlayer = nextAgenda.perPlayer;
  }

  advanceAct() {
    const act = this.state.act;
    const actDef = this.scenarioData.acts[act.currentIndex];

    this.addLog('narrative', `Act advances: ${actDef.backText}`);

    act.currentIndex++;
    if (act.currentIndex >= act.totalActs) {
      // Final act advanced - scenario ends (good)
      this.endScenario('resolution_1');
      return;
    }

    const nextAct = this.scenarioData.acts[act.currentIndex];
    act.clueThresholdBase = nextAct.clueThreshold;
    act.perPlayer = nextAct.perPlayer;
  }

  // ---- Scenario End ----

  endScenario(resolutionId) {
    this.state.scenarioEnded = true;
    this.state.resolution = resolutionId;

    const res = this.scenarioData.resolutions.find(r => r.id === resolutionId);
    if (res) {
      this.addLog('narrative', `SCENARIO ENDS: ${res.title}`);
      this.addLog('narrative', res.text);

      // Calculate XP
      let xp = 0;
      for (const id of this.state.victoryDisplay) {
        const enemy = this.state.enemies[id];
        if (enemy) {
          const def = this.getEnemyDef(enemy.definitionId);
          xp += def?.victoryPoints || 0;
        }
      }
      xp += res.xpBonus;
      xp -= res.xpPenalty;
      this.state.earnedExperience = Math.max(0, xp);

      this.addLog('system', `Experience earned: ${this.state.earnedExperience} XP`);
    }

    this.broadcastState();
  }

  checkAllEliminated() {
    const allEliminated = this.state.playerOrder.every(
      pid => this.state.players[pid].isEliminated
    );
    if (allEliminated) {
      this.endScenario('no_resolution');
    }
  }

  // ---- Definition Lookups ----

  getCardDef(id) {
    return this.cardDefinitions.allCards?.[id] || null;
  }

  getEnemyDef(id) {
    return this.cardDefinitions.enemyDefs?.[id] || null;
  }

  getTreacheryDef(id) {
    return this.cardDefinitions.treacheryDefs?.[id] || null;
  }

  // ---- State Broadcasting ----

  addLog(type, message, playerId) {
    this.state.log.push({
      id: 'log_' + Math.random().toString(36).substring(2, 8),
      timestamp: Date.now(),
      type,
      message,
      playerId,
    });

    // Keep log manageable
    if (this.state.log.length > 200) {
      this.state.log = this.state.log.slice(-150);
    }
  }

  getClientState(forPlayerId) {
    const state = this.state;
    const clientPlayers = {};

    for (const [pid, player] of Object.entries(state.players)) {
      clientPlayers[pid] = {
        ...player,
        deckSize: player.deck.length,
        hand: pid === forPlayerId ? player.hand : [],
        handSize: player.hand.length,
        deck: undefined, // Don't send deck contents
      };
      delete clientPlayers[pid].deck;
    }

    return {
      ...state,
      players: clientPlayers,
      encounterDeckSize: state.encounterDeck.length,
      encounterDeck: undefined,
      chaosTokenTypes: [...new Set(state.chaosTokens)],
      chaosTokens: undefined,
      myPlayerId: forPlayerId,
    };
  }

  broadcastState() {
    if (!this.io) return;

    for (const pid of this.state.playerOrder) {
      const player = this.state.players[pid];
      if (!player.connected) continue;

      const clientState = this.getClientState(pid);
      // Get socket ID for this player from room manager
      // For now, emit to room and let client filter
      this.io.to(this.roomId).emit('game:full_state', clientState);
      break; // Simplified: send one state to whole room for now
    }
  }
}

module.exports = { GameEngine };
