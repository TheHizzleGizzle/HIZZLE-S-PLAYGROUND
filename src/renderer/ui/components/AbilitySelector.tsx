/**
 * Ability Selector Component
 * Displays available abilities and allows selection
 */

import React from 'react';
import { Ability } from '@shared/types/Ability';
import './AbilitySelector.css';

interface AbilitySelectorProps {
  abilities: Ability[];
  selectedAbility: Ability | null;
  onSelect: (ability: Ability) => void;
  onUse: () => void;
}

export const AbilitySelector: React.FC<AbilitySelectorProps> = ({
  abilities,
  selectedAbility,
  onSelect,
  onUse
}) => {
  return (
    <div className="ability-selector">
      <div className="ability-selector-title">Select Ability</div>
      <div className="ability-list">
        {abilities.map((ability, index) => (
          <button
            key={ability.id}
            className={`ability-button ${
              selectedAbility?.id === ability.id ? 'selected' : ''
            }`}
            onClick={() => onSelect(ability)}
            disabled={!ability.codeText}
          >
            <div className="ability-name">{ability.name || `Ability ${index + 1}`}</div>
            {ability.description && (
              <div className="ability-description">{ability.description}</div>
            )}
            {selectedAbility?.id === ability.id && (
              <div className="ability-preview">
                <code>{ability.codeText.substring(0, 50)}...</code>
              </div>
            )}
          </button>
        ))}
      </div>
      {selectedAbility && (
        <button className="use-ability-button" onClick={onUse}>
          Use {selectedAbility.name}
        </button>
      )}
    </div>
  );
};
