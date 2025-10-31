/**
 * Battle UI Component
 * Main battle interface showing creatures, abilities, and battle log
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/store';
import { selectAbility, clearSelectedAbility } from '@store/slices/battleSlice';
import { Ability } from '@shared/types/Ability';
import { AbilitySelector } from './AbilitySelector';
import { BattleLog } from './BattleLog';
import { CreatureDisplay } from './CreatureDisplay';
import './BattleUI.css';

export const BattleUI: React.FC = () => {
  const dispatch = useDispatch();
  const { currentBattle, selectedAbility, isPlayerTurn } = useSelector(
    (state: RootState) => state.battle
  );

  if (!currentBattle) {
    return <div className="battle-ui">No active battle</div>;
  }

  const handleAbilitySelect = (ability: Ability) => {
    if (isPlayerTurn && currentBattle.status === 'active') {
      dispatch(selectAbility(ability));
    }
  };

  const handleUseAbility = () => {
    if (selectedAbility && isPlayerTurn) {
      // Battle execution will be handled by BattleScene
      console.log('Using ability:', selectedAbility.name);
    }
  };

  return (
    <div className="battle-ui">
      <div className="battle-container">
        {/* Enemy Creature */}
        <div className="creature-section enemy-section">
          <CreatureDisplay
            creature={currentBattle.enemyCreature}
            isPlayer={false}
          />
        </div>

        {/* Battle Log */}
        <div className="battle-log-section">
          <BattleLog log={currentBattle.battleLog} />
        </div>

        {/* Player Creature */}
        <div className="creature-section player-section">
          <CreatureDisplay
            creature={currentBattle.playerCreature}
            isPlayer={true}
          />
        </div>

        {/* Ability Selector */}
        {isPlayerTurn && currentBattle.status === 'active' && (
          <div className="ability-section">
            <AbilitySelector
              abilities={currentBattle.playerCreature.abilities}
              selectedAbility={selectedAbility}
              onSelect={handleAbilitySelect}
              onUse={handleUseAbility}
            />
          </div>
        )}

        {/* Battle Status */}
        {currentBattle.status !== 'active' && (
          <div className="battle-status">
            <div className={`status-message ${currentBattle.status}`}>
              {currentBattle.status === 'player-won' && 'Victory!'}
              {currentBattle.status === 'player-lost' && 'Defeat!'}
              {currentBattle.status === 'fled' && 'Fled from battle!'}
            </div>
            <button
              className="battle-button"
              onClick={() => {
                // Return to world
                dispatch(clearSelectedAbility());
              }}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
