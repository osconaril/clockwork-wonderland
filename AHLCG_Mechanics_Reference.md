# Arkham Horror: The Card Game - Complete Mechanics Reference
## For Digital Adaptation Development

---

## 1. CORE GAME STRUCTURE

### Overview
Arkham Horror: The Card Game (AHLCG) is a cooperative Living Card Game for 1-4 players. Each player controls one investigator with a unique pre-built (then customized) deck of 30+ cards. Players work together through scenarios, each of which uses a shared encounter deck, location map, agenda deck (enemy timer), and act deck (player objectives).

### Round Structure
Each round consists of **4 phases** executed in order. The **Mythos Phase is skipped on the very first round** of a scenario.

#### Phase 1: MYTHOS PHASE
1. **Mythos phase begins** (player window for fast/reaction abilities)
2. **Place 1 doom token** on the current agenda card
3. **Check doom threshold**: Count ALL doom in play (on agenda + on any cards in play like enemies or assets). If total doom >= the agenda's doom threshold, the agenda advances (flip/resolve the back, move to next agenda card). When the agenda advances, **all doom is removed from all cards in play**.
4. **Each investigator draws 1 encounter card** from the encounter deck (in player order, starting with the lead investigator). Resolve each card's Revelation effect or spawn the enemy as appropriate.
5. **Mythos phase ends**

#### Phase 2: INVESTIGATOR PHASE
1. **Investigator phase begins** (player window)
2. **Investigators take turns** starting with the lead investigator, proceeding clockwise:
   - The active investigator may take **up to 3 actions** (see Actions section below)
   - Between each action there is a player window for fast/free-trigger abilities
   - After all 3 actions are spent (or the investigator chooses to end early), that investigator's turn ends
3. After all investigators have taken their turns, the **investigator phase ends**

**Key rule**: Investigators can take their turns in any agreed-upon order (starting with the lead investigator).

#### Phase 3: ENEMY PHASE
1. **Enemy phase begins**
2. **Hunter enemies move**: Each ready, unengaged enemy with the Hunter keyword moves one location toward the nearest investigator. If tied for nearest, the enemy moves toward its "prey" (a keyword on the enemy card designating preferred targets).
3. **Engaged enemies attack**: For each investigator (in player order), resolve attacks from all ready enemies engaged with that investigator. The attacked investigator chooses the order enemies attack. Each enemy deals its listed damage AND horror simultaneously. After attacking, the **enemy exhausts** (turned sideways).
4. **Enemy phase ends**

**Important**: Enemies ONLY exhaust from attacking during the enemy phase. Attacks of opportunity and other triggered attacks do NOT exhaust the enemy.

#### Phase 4: UPKEEP PHASE
1. **Upkeep phase begins** (player window)
2. **Reset actions** for all investigators
3. **Ready all exhausted cards** (turn them upright) -- this includes both player cards and enemy cards
4. **Each investigator draws 1 card** from their deck and **gains 1 resource**
5. **Hand size check**: Each investigator checks against hand size limit (default: 8 cards). Discard down to limit if exceeded.
6. **Upkeep phase ends; Round ends**

---

## 2. CARD TYPES

### Player Cards (Investigator Deck)

#### Investigator Card (Identity)
- **Not shuffled into the deck** -- sits in play from the start
- Has 4 skill values: **Willpower**, **Intellect**, **Combat**, **Agility**
- Has **Health** (physical hit points) and **Sanity** (mental hit points)
- Has a unique **Elder Sign ability** (triggered when the Elder Sign chaos token is drawn during their skill test)
- Back side lists: **Deckbuilding Options** (what cards they can include), **Deckbuilding Requirements** (cards they must include, like signature cards and weaknesses)
- Belongs to one of 5 classes: **Guardian, Seeker, Mystic, Rogue, Survivor** (or may be multi-class/neutral)

#### Asset Cards
- Represent items, allies, talents, spells, equipment
- Have a **resource cost** (paid from the investigator's resource pool to play)
- Occupy **slots**: 2 Hand slots, 2 Arcane slots, 1 Body slot, 1 Ally slot, 1 Accessory slot. Some assets take no slot. Some take 2 hand slots (two-handed items).
- Remain in play once played until discarded by effect or defeated
- May have **health and/or sanity values** -- can absorb damage/horror assigned to them
- May have skill icons (for committing to tests from hand) and abilities (activated while in play)
- If you play an asset requiring a slot that's full, you must **discard an existing asset** in that slot to make room
- Can be **exhausted** (turned sideways) to pay costs; cannot be used again until readied in the Upkeep phase

#### Event Cards
- One-time effects played from hand
- Have a **resource cost**
- Resolve their effect, then are **discarded** to the discard pile
- May have skill icons for committing to tests instead of playing

#### Skill Cards
- **Cannot be played** -- exist solely to be **committed to skill tests**
- Have one or more skill icons (Willpower, Intellect, Combat, Agility, or Wild)
- Each matching icon committed adds +1 to the investigator's skill value for that test
- Wild icons count for any skill type
- Many skill cards also have additional text effects that trigger if the test succeeds or fails
- Discarded after the skill test resolves regardless of outcome

#### Weakness Cards
Two subtypes:
- **Investigator-specific weakness**: Required in the investigator's deck per deckbuilding requirements. Tied to their story/character.
- **Basic weakness**: One random basic weakness is added to each investigator's deck during deckbuilding. These are generic negative effects any investigator might face.

Weakness mechanics:
- When drawn from your deck (during a draw action or upkeep), their **Revelation** effect triggers immediately
- Treachery weaknesses resolve and go to discard (or attach to something)
- Enemy weaknesses **spawn engaged** with you and must be dealt with
- Asset weaknesses enter play and typically have ongoing negative effects
- Weaknesses **do not count** toward the 30-card deck size minimum
- Cannot be optionally discarded or removed from deck between scenarios (with rare exceptions)

### Scenario Cards (Encounter Deck & Setup)

#### Agenda Cards (Doom Clock)
- Form the **Agenda Deck** -- a sequential stack of cards representing the villain's plan progressing
- Each agenda has a **doom threshold** (number at bottom). Some thresholds scale "per investigator" (e.g., "3 per investigator" = 6 doom with 2 players)
- During Mythos phase, 1 doom is placed on the agenda each round; some encounter effects add extra doom
- When total doom in play (on agenda + all other cards) >= threshold, the agenda **advances**
- Advancing flips the current agenda to read its back (usually bad narrative consequences), then moves to the next agenda card
- **All doom is removed from all cards** when the agenda advances
- If the final agenda advances, the scenario typically ends (often in failure/bad resolution)

#### Act Cards (Player Objectives)
- Form the **Act Deck** -- a sequential stack representing the investigators' progress
- Each act has a **clue threshold** (number at bottom). May scale "per investigator."
- Investigators can collectively **spend clues** equal to the threshold to advance the act (this is a free action; it can be done during any player window in the investigator phase)
- Advancing the act flips it for narrative text, then moves to the next act card
- Advancing the final act typically leads to scenario resolution (often success/good resolution)
- Clues spent to advance acts are **returned to the token pool**, not to locations

#### Location Cards
- **Double-sided**: Unrevealed (face-down) and Revealed (face-up)
- **Unrevealed side** shows: location name, connection icons (which other locations connect to it)
- **Revealed side** shows: location name, **Shroud value** (investigation difficulty), **Clue value** (how many clues are placed when revealed, often "per investigator"), connection icons, and special abilities/text
- Locations are **revealed** when an investigator first moves to them (or per scenario instructions)
- When revealed, place clue tokens on the location equal to its clue value (adjusted for player count if "per investigator")
- **Connections**: A location connects to another if they share at least one matching connection symbol. Movement is only allowed between connected locations.
- Locations can exist with 0 clues (either starting that way or after all clues are picked up)

#### Enemy Cards (Encounter)
- Have **Fight value** (difficulty to hit in combat), **Health** (damage to defeat), **Evade value** (difficulty to evade)
- Have **Damage value** and **Horror value** (what they deal when attacking)
- May have keywords: Hunter, Aloof, Massive, Retaliate, Alert, etc.
- May have a **Spawn** instruction (specifying where they appear); without one, they spawn engaged with the investigator who drew them
- May have a **Prey** instruction (who they prefer to engage/hunt)
- May have a **Victory X** value -- if defeated, placed in the Victory Display (worth X experience at end of scenario)
- Enemies exist either at a location (unengaged) or in an investigator's "threat area" (engaged)

#### Treachery Cards (Encounter)
- Drawn from the encounter deck during Mythos phase
- Have a **Revelation** effect that triggers immediately when drawn
- After resolving, either discarded or attached to an investigator/location/other card as an ongoing effect
- Keywords:
  - **Surge**: After resolving, draw and resolve another encounter card
  - **Peril**: The investigator who drew it cannot receive help from other players while resolving it
  - **Hidden**: Goes into the investigator's hand and takes effect later

---

## 3. PLAYER MECHANICS - ACTIONS

Each investigator gets **3 actions per turn** during the Investigator Phase. The same action can be taken multiple times (e.g., move 3 times, or investigate 3 times).

### Basic Actions:

1. **Draw**: Draw 1 card from your investigator deck into your hand.

2. **Resource**: Gain 1 resource from the token pool.

3. **Play a Card**: Play an asset or event card from your hand. Pay its resource cost. Assets enter your play area; events resolve and are discarded.

4. **Move**: Move your investigator to a **connected** location. If moving to an unrevealed location, reveal it and place its clues.

5. **Investigate**: Perform an **Intellect skill test** against the **Shroud value** of your current location. On success, discover 1 clue from your location (take a clue token from the location and place it on your investigator card). On failure, nothing happens (unless a card effect says otherwise).

6. **Fight**: Choose an enemy at your location. Perform a **Combat skill test** against the enemy's **Fight value**. On success, deal 1 damage to the enemy (base amount; weapons/spells may increase this). On failure, the attack misses and deals no damage. **Important**: If you fail a fight test, you deal no damage to the enemy, but some enemies have the **Retaliate** keyword which causes them to attack you back on a failed fight attempt.

7. **Evade**: Choose an enemy **engaged with you**. Perform an **Agility skill test** against the enemy's **Evade value**. On success, the enemy is **exhausted** (turned sideways) and **disengaged** from you (remains at the location but no longer in your threat area). Exhausted enemies cannot attack during the enemy phase, cannot make attacks of opportunity, and do not re-engage until readied. On failure, nothing happens. **Alert** enemies attack you if you fail an evade attempt.

8. **Engage**: Choose a **ready, unengaged enemy** at your location and engage it (move it to your threat area). Primarily used for: pulling enemies off other investigators, or engaging **Aloof** enemies (which don't auto-engage).

9. **Activate**: Use an "Action:" ability printed on a card you control that is in play. (Some abilities have bold action designators like "**Fight**" or "**Investigate**" which means they count as that action type for rules purposes.)

10. **Parley**: A special action type used by certain scenario or card abilities, typically involving negotiation with story NPCs.

11. **Resign**: Leave the scenario. The investigator is removed from the game as if eliminated but does NOT suffer trauma. They drop all their clues at their current location. Available only at specific locations designated by the scenario.

### Attacks of Opportunity
- If you take **any action other than Fight, Evade, Parley, or Resign** while engaged with a ready enemy, that enemy immediately performs an **attack of opportunity** against you
- The attack resolves AFTER you pay the cost of the action but BEFORE the action's effect resolves
- Attacks of opportunity deal the enemy's damage and horror to you
- The enemy does NOT exhaust from attacks of opportunity
- **Fast** cards and free triggered abilities do NOT provoke attacks of opportunity

### Fast Keyword
- Cards with the **Fast** keyword do not cost an action to play
- Fast assets/events are played during appropriate player windows
- Free triggered abilities (marked with a lightning bolt icon) also don't cost actions and don't provoke attacks of opportunity

### Exhaust/Ready
- Many card abilities require you to **exhaust** the card (turn sideways) as a cost
- Exhausted cards cannot be exhausted again until **readied**
- All exhausted cards are readied during the Upkeep phase (Phase 4, step 3)
- This applies to both player cards AND enemy cards

---

## 4. SKILL TESTS - DETAILED SEQUENCE

Skill tests are the core resolution mechanic. There are 4 types: **Willpower**, **Intellect**, **Combat**, **Agility**.

### Step-by-Step Timing:

**ST.1 -- Determine skill type and difficulty**
- The triggering card/action determines which skill is tested and the difficulty number
- Fight action: Combat vs. enemy's Fight value
- Investigate action: Intellect vs. location's Shroud value
- Evade action: Agility vs. enemy's Evade value
- Treachery cards: Often Willpower vs. a stated difficulty

**ST.2 -- Commit cards from hand**
- The active investigator may commit **any number of cards** from their hand that have an appropriate skill icon (matching the skill being tested, or a Wild icon)
- Each **other investigator at the same location** may commit **exactly 1 card** with an appropriate icon
- Each matching icon on committed cards adds **+1** to the investigator's skill value
- Committed cards are set aside (they will be discarded after the test regardless of outcome)
- **Important**: Skill cards can ONLY be used by committing them to tests; they cannot be "played"

**ST.3 -- Reveal chaos token**
- The investigator reveals **1 chaos token** at random from the chaos bag
- (Some card effects allow revealing additional tokens or choosing among multiple)

**ST.4 -- Resolve chaos token effect(s)**
- Apply any effects triggered by the revealed token's symbol
- Numbered tokens (+1, 0, -1, -2, etc.): The number modifies the skill value
- Symbol tokens (Skull, Cultist, Tablet, Elder Thing): Their effect is defined on the **scenario reference card** and varies per scenario/difficulty. These typically impose a negative modifier and sometimes additional penalties.
- **Elder Sign**: Resolve the investigator's Elder Sign ability (printed on their investigator card). Usually beneficial.
- **Auto-Fail (Tentacle)**: The test automatically fails regardless of skill value. No other modifiers matter.

**ST.5 -- Determine modified skill value**
- Calculate: Base skill value + committed icons + chaos token modifier + any other active card modifiers
- This is the investigator's final test value

**ST.6 -- Determine success/failure**
- If modified skill value **>= difficulty**: **SUCCESS**
- If modified skill value **< difficulty**: **FAILURE**
- Auto-fail token always = failure
- If the test succeeds/fails "by X," X = the difference between modified skill value and difficulty

**ST.7 -- Apply skill test results**
- Resolve the consequences: damage dealt (fight), clue discovered (investigate), enemy exhausted/disengaged (evade), etc.
- Resolve any "if this test succeeds/fails" effects on committed cards or active abilities

**ST.8 -- Skill test ends**
- All committed cards are discarded (to their owner's discard pile)
- Return the chaos token to the bag

### Chaos Bag Composition
The chaos bag contains tokens placed per scenario setup, which varies by chosen difficulty level (Easy, Standard, Hard, Expert). Higher difficulties have:
- More severely negative number tokens
- Worse effects on symbol tokens
- Fewer or no positive tokens

**Standard token types**:
- **Numeric tokens**: +1, 0, -1, -2, -3, -4, -5, -6, -7, -8 (varying quantities per difficulty)
- **Symbol tokens**: Skull, Cultist, Tablet, Elder Thing (effects defined per scenario)
- **Elder Sign**: 1 token, positive effect (investigator-specific)
- **Auto-Fail (Tentacle/Squid)**: 1 token, always present, always causes failure

---

## 5. HEALTH AND SANITY SYSTEM

### Two Damage Tracks
Each investigator has:
- **Health** (typically 5-9): Absorbs physical **damage**
- **Sanity** (typically 5-9): Absorbs mental **horror**

### Dealing Damage/Horror (Assignment Process)
When an investigator is dealt damage and/or horror:

**Step 1 -- Assign**: The investigator distributes the incoming damage/horror among:
- Their **investigator card** (directly)
- Any **eligible assets they control** that have health (for damage) or sanity (for horror)
- An asset cannot be assigned damage beyond its remaining health or horror beyond its remaining sanity
- Any damage/horror that cannot be assigned to assets MUST go on the investigator card

**Step 2 -- Apply**: Place damage/horror tokens simultaneously on all assigned targets.

### Defeat Conditions
- If an investigator has **damage equal to or exceeding their health**: they are **defeated** (killed)
- If an investigator has **horror equal to or exceeding their sanity**: they are **defeated** (driven insane)
- A defeated investigator is **eliminated from the scenario**
- If an **asset** has damage >= its health OR horror >= its sanity, the asset is **defeated and discarded**

### Trauma (Campaign Consequence)
- If defeated by damage: investigator suffers **1 physical trauma** (recorded in campaign log)
- If defeated by horror: investigator suffers **1 mental trauma** (recorded in campaign log)
- Each physical trauma = start every subsequent scenario with **1 damage already on the investigator**
- Each mental trauma = start every subsequent scenario with **1 horror already on the investigator**
- If physical trauma **equals** printed health: investigator is **killed permanently** (cannot be used further in the campaign)
- If mental trauma **equals** printed sanity: investigator is **driven insane permanently** (cannot be used further in the campaign)
- A killed/insane investigator's player must choose a new investigator and build a new deck for the next scenario

### Direct Damage/Horror
- Some effects deal "**direct**" damage or horror
- Direct damage/horror **must be assigned to the investigator card** -- it CANNOT be assigned to assets
- This bypasses the normal choice of distributing to soak assets

---

## 6. SCENARIO AND CAMPAIGN STRUCTURE

### Scenario Structure
Each scenario is a self-contained adventure consisting of:
- **Scenario setup instructions** (which locations to place, how to build the encounter deck, starting positions, special rules)
- **A set of locations** forming a map
- **An Agenda Deck** (usually 2-3 agenda cards)
- **An Act Deck** (usually 2-3 act cards)
- **An Encounter Deck** (built from specified encounter sets)
- **A Scenario Reference Card** (defines chaos token symbol effects and special rules)

### Campaign Structure
- A campaign consists of **multiple scenarios played in sequence** (typically 8 per full campaign; the introductory Night of the Zealot campaign has 3)
- Between scenarios, investigators retain their decks, trauma, and experience
- The **Campaign Log** tracks story choices, trauma, experience, and narrative flags that affect future scenarios
- Choices made in one scenario can change setup, encounter deck composition, or available resolutions in later scenarios
- Some campaigns have **branching paths** where players choose which scenario to play next

### Experience Points (XP) System
- At the end of each scenario, investigators earn XP equal to:
  - The **total Victory value** of all cards in the **Victory Display** (enemies with Victory X that were defeated, plus certain locations or other cards with Victory values that were resolved)
  - Plus/minus **any XP bonuses or penalties** listed in the scenario resolution
- XP is **shared equally** among all investigators (each investigator gets the full amount)
- Unspent XP carries over to future scenarios

### Deck Building Between Scenarios
After each scenario, investigators may spend XP to upgrade their deck:

**Purchasing new cards**:
- Spend XP equal to the **card's level** (printed as dots/pips: 0-5)
- Level 0 cards cost **1 XP** each to add (minimum cost of 1)
- Higher level cards cost XP equal to their level (level 3 = 3 XP, level 5 = 5 XP)
- Must respect the investigator's **deckbuilding restrictions** (class, level limits, etc.)
- For each card added, **one card must be removed** to maintain deck size

**Upgrading existing cards**:
- You can swap a lower-level version of a card for a higher-level version
- Cost = difference in levels (upgrading a level 0 card to level 2 = 2 XP; upgrading level 2 to level 4 = 2 XP)
- The lower-level card is removed and the higher-level card takes its slot

**Deckbuilding Rules**:
- Standard deck size: **exactly 30 cards** (not counting weaknesses/signature cards that say "do not count toward deck size")
- At campaign start: only **level 0** cards may be included (no XP yet)
- Each investigator card specifies which card classes/types they can access
- Example: "Guardian cards level 0-5, Neutral cards level 0-5" or "Seeker cards level 0-5, Mystic cards level 0-2"
- 5 main classes: **Guardian** (combat/protection), **Seeker** (clue-gathering/knowledge), **Mystic** (willpower/spells), **Rogue** (evasion/resources/tricks), **Survivor** (resilience/luck)
- **Neutral** cards can be included by any investigator
- Each investigator has **signature cards** (1+ required assets/events) and an **investigator-specific weakness** that MUST be in their deck
- Plus 1 **random basic weakness** drawn during deckbuilding
- Maximum **2 copies** of any card by title (except weaknesses)

---

## 7. ENEMY ENGAGEMENT SYSTEM

### Enemy States
- **At a location (unengaged)**: The enemy is at a location but not engaged with anyone
- **Engaged (in threat area)**: The enemy is engaged with a specific investigator -- conceptually it's "in their face." Represented by placing the enemy card near that investigator.
- **Exhausted**: Turned sideways. Cannot attack, cannot engage, cannot make attacks of opportunity.
- **Ready**: Upright. Active and dangerous.

### Spawning
- When an investigator draws an enemy from the encounter deck during Mythos phase:
  - If the enemy has a **"Spawn --"** instruction: place it at the specified location
  - If no Spawn instruction: the enemy spawns **engaged with the investigator who drew it**
- After spawning at a location, a ready non-Aloof enemy **immediately engages** an investigator at that location

### Automatic Engagement
- A **ready, unengaged** enemy at a location with investigators will **automatically engage** an investigator at that location (following Prey instructions if applicable)
- This happens as a constant check -- whenever both an investigator and an unengaged ready enemy are at the same location
- If multiple investigators are at the location, the enemy engages its **Prey** target if specified, otherwise the **lead investigator** (or nearest in player order)

### Engagement = Threat Area
- An engaged enemy is placed in the investigator's **threat area**
- The investigator is "locked" with this enemy -- taking non-combat actions provokes attacks of opportunity
- Moving away: if an investigator moves, engaged enemies **move with them** (they stay engaged)
- Exception: **Massive** enemies do not move into threat areas and are not dragged along when investigators move

### Enemy Keywords

**Hunter**: During the Enemy Phase, if this enemy is ready and unengaged, it moves 1 location toward the nearest investigator. Uses shortest path. If tied, moves toward its Prey.

**Aloof**: Does NOT automatically engage investigators. Spawns unengaged even at an investigator's location. Must be engaged via the Engage action or card ability. Cannot be attacked unless engaged. Still moves if it also has Hunter.

**Massive**: Engages ALL investigators at its location simultaneously. Is not placed in any single investigator's threat area -- it sits at the location. When ready, it is considered engaged with every investigator there. When exhausted, it is not engaged with anyone. Does not move when investigators move away.

**Retaliate**: If an investigator fails a Fight test against this enemy, the enemy immediately attacks that investigator (dealing its damage and horror).

**Alert**: If an investigator fails an Evade test against this enemy, the enemy immediately attacks that investigator.

**Prey** (not a keyword but a trait instruction): Specifies which investigator the enemy prefers to engage or pursue (e.g., "Prey -- lowest agility").

**Victory X**: When defeated, this enemy is placed in the **Victory Display** instead of the discard pile. Worth X experience points at end of scenario.

### Combat Sequence (Fight Action)
1. Choose an enemy at your location (if unengaged) or engaged with you
2. Perform a **Combat skill test** vs. the enemy's **Fight value**
3. If successful: deal **1 damage** (base) to the enemy. Weapons/spells may increase damage.
4. If failed: no damage dealt. If enemy has Retaliate, it attacks you.
5. When an enemy has **damage >= its health**, it is **defeated** and discarded (or placed in Victory Display if it has Victory).

### Evade Sequence
1. Choose an enemy **engaged with you**
2. Perform an **Agility skill test** vs. the enemy's **Evade value**
3. If successful: the enemy is **exhausted** and **disengaged** (moved from your threat area to the location). It will not attack this enemy phase and won't re-engage until readied in Upkeep.
4. If failed: nothing happens. If enemy has Alert, it attacks you.

---

## 8. LOCATION SYSTEM

### Location Card Anatomy
- **Unrevealed side** (face-down): Name, connection symbols, possibly a "Clue" value shown as a hint
- **Revealed side** (face-up): Name, **Shroud** value (top left), **Clue value** (top right, often "per investigator"), connection symbols, ability text, traits

### Core Mechanics

**Revealing**: A location is revealed (flipped to its revealed side) when an investigator enters it for the first time. Upon revealing:
- Place **clue tokens** on the location equal to its clue value
- "Per investigator" clue values scale: e.g., 2 clues per investigator = 4 clues with 2 players, 6 with 3, 8 with 4
- Some locations start with 0 clues

**Connections**: Locations display connection symbols (icons). Two locations are **connected** if they share at least one matching connection symbol. Connections are bidirectional. Investigators can only Move to connected locations.

**Shroud**: The difficulty for Investigate actions at this location. Higher shroud = harder to find clues. Tested against the investigator's **Intellect** skill.

**Investigating**: Spend 1 action to investigate. Perform an Intellect test vs. Shroud. On success, take 1 clue from the location. On failure, no clue gained. You cannot investigate a location with 0 clues (well, you can attempt it, but there's nothing to discover -- some card effects still care about succeeding at investigations).

**Clue Tokens on Investigators**: Discovered clues sit on your investigator card. They are spent collectively to advance the Act deck. Any investigator can contribute clues, and they don't need to be at the same location to contribute (clue-spending is done during a player window, not tied to location).

**Entering and Leaving**: Moving to a new location costs 1 action. You move from your current location to any connected location. If the destination is unrevealed, reveal it.

**Investigators at the Same Location**: Being at the same location allows:
- Committing 1 card to each other's skill tests
- Using the Engage action to pull enemies off other investigators
- Playing cards that target investigators at your location
- Trading (some items can be traded with another investigator action)

---

## 9. MULTIPLAYER

### Cooperative Structure
- Fully cooperative -- all players win or lose together
- **1-4 players** supported officially (each controlling exactly 1 investigator)
- Communication is open -- players can discuss strategy, show their hands, plan actions
- Exception: **Peril** keyword cards cannot be discussed while resolving them

### Turn Structure in Multiplayer
- A **lead investigator** is designated (first player token). Rotates clockwise at the start of each round.
- During the Mythos phase, encounter cards are drawn in player order starting with the lead investigator
- During the Investigator phase, turns go in **player order** starting with the lead investigator, but players may agree to change the order
- During the Enemy phase, enemy attacks resolve in player order
- During Upkeep, all effects happen simultaneously

### Player Count Scaling
The game scales difficulty in several ways:
- **"Per investigator" values**: Clues on locations, some doom thresholds on agendas, and some clue thresholds on acts scale with player count
- **Encounter cards**: Each investigator draws 1 encounter card per Mythos phase, so more players = more encounter cards drawn per round
- **Chaos bag**: The chaos bag composition does NOT change with player count (it's set by scenario + difficulty level)
- More investigators means more total actions per round but also more enemies/treacheries drawn

### True Solo vs. Two-Handed Solo
- **True solo**: 1 player, 1 investigator. Fully supported but very challenging due to needing all skill types.
- **Two-handed solo**: 1 player controlling 2 investigators. Common community play style.

### Bonded Actions Between Players
- Players at the same location can commit 1 card each to each other's skill tests
- Players can engage enemies engaged with other investigators at the same location
- Certain cards allow players to heal, buff, or otherwise assist teammates

---

## 10. WIN/LOSE CONDITIONS

### How Scenarios End
Scenarios end when one of these occurs:
1. **The final Act advances**: Usually a positive resolution. Read the specified resolution in the campaign guide.
2. **The final Agenda advances**: Usually a negative resolution. The "doom clock" ran out.
3. **All investigators are eliminated**: Either defeated (killed/insane) or resigned. If no one is left in play, the scenario ends.
4. **A card effect ends the scenario**: Some specific encounter or act/agenda effects trigger an immediate end.

### Resignation
- Some locations have a **Resign** action (or cards grant it)
- Resigning removes the investigator from the scenario without suffering trauma
- The resigned investigator **drops all clues** at their current location
- They are treated as eliminated for rules purposes but suffer no trauma
- Resigned investigators still earn XP and experience the scenario resolution
- Resigning does NOT provoke attacks of opportunity

### Defeat
- An investigator defeated by damage = suffers 1 **physical trauma**
- An investigator defeated by horror = suffers 1 **mental trauma**
- Defeated investigators drop all clues at their location
- They may miss out on certain resolution benefits depending on the scenario

### Resolution
- Each scenario has **multiple numbered resolutions** (Resolution 1, Resolution 2, etc.) plus sometimes a "no resolution" outcome
- Which resolution occurs depends on how the scenario ended (which act/agenda was active, whether investigators resigned, specific game-state flags)
- Resolutions provide: narrative text, campaign log entries, XP bonuses/penalties, trauma, new cards added/removed, and setup modifications for future scenarios
- The campaign guide is the authority on exactly which resolution applies

### Victory Display
- Cards with **Victory X** are placed in the Victory Display when their conditions are met (enemies defeated, locations fully investigated, etc.)
- At end of scenario, total Victory X value from all cards in the display = base XP earned
- Resolution text may add or subtract from this total
- All investigators earn the same XP total

### Campaign Ending
- Campaigns have a final scenario whose resolution determines the overall campaign outcome
- Outcomes range from total success to total failure with various intermediate results
- The campaign log tracks which endings were achieved

---

## ADDITIONAL MECHANICAL DETAILS

### Player Windows
- Between most game steps, there is a "player window" where investigators can use **Fast** cards and **free triggered abilities** (reaction/free abilities)
- These windows allow responsive play without spending actions
- Triggered abilities use specific timing: **Reaction** (after a trigger occurs), **Forced** (must trigger), **Free triggered** (during any player window)

### Doom on Non-Agenda Cards
- Some cards place doom on themselves or other cards in play (enemies, assets, locations)
- This doom **counts toward the agenda threshold** -- it accelerates the doom clock
- When the agenda advances, ALL doom is removed from ALL cards, not just the agenda

### Supply/Demand of Cards
- If your investigator deck runs out and you need to draw, **shuffle your discard pile** to form a new deck. Then suffer **1 horror** (representing mental strain of recycling through your knowledge).
- If the encounter deck runs out, shuffle the encounter discard pile to form a new encounter deck.

### Weakness Handling During Draws
- If you draw a weakness during any card draw (including Upkeep draw), it does not count as your "drawn card." Resolve the weakness, then continue drawing until you've drawn the required number of non-weakness cards.

### Slots Summary Table
| Slot | Quantity | Typical Cards |
|------|----------|--------------|
| Hand | 2 | Weapons, tools, flashlights |
| Arcane | 2 | Spells, tomes (magical) |
| Body | 1 | Armor, bandolier |
| Ally | 1 | NPC companions |
| Accessory | 1 | Amulets, holy items, relics |

### Skill Icons Reference
Cards may have these icons (used when committing to tests):
- **Willpower** (book/fist symbol) -- adds to willpower tests
- **Intellect** (magnifying glass) -- adds to intellect tests
- **Combat** (fist) -- adds to combat tests
- **Agility** (foot) -- adds to agility tests
- **Wild** (star/burst) -- adds to ANY test type

Each icon committed = **+1** to the relevant skill value for that test.

---

## KEY DESIGN PATTERNS FOR DIGITAL ADAPTATION

1. **Tension through dual-timer**: The Agenda (doom) and Act (clues) create a race condition. Players must gather clues faster than doom accumulates.

2. **Randomness through chaos bag, not dice**: The chaos bag is a customizable probability space. Tokens can be added/removed by scenario effects, giving fine-grained difficulty control.

3. **Action economy is tight**: 3 actions per turn with enemies demanding Fight/Evade actions creates constant pressure on how to spend actions.

4. **Persistent consequences**: Trauma, deck upgrades, and campaign log entries create a meaningful progression arc across scenarios.

5. **Asymmetric investigators**: Each investigator has different stats, abilities, and deckbuilding rules, encouraging complementary team composition.

6. **Scalable difficulty**: 4 difficulty levels per scenario (Easy/Standard/Hard/Expert) primarily through chaos bag composition and symbol token effects.

7. **Information uncertainty**: Unrevealed locations, the chaos bag, and the encounter deck create multiple layers of unknown information.

8. **Soak system**: Assets with health/sanity create a buffer system where players choose how to distribute incoming damage/horror across their cards.
