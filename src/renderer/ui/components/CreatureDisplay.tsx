/**
 * Creature Display Component
 * Shows creature sprite, name, level, and HP bar
 */

import React from 'react';
import { BattleCreature } from '@shared/types/Battle';
import './CreatureDisplay.css';

interface CreatureDisplayProps {
  creature: BattleCreature;
  isPlayer: boolean;
}

export const CreatureDisplay: React.FC<CreatureDisplayProps> = ({
  creature,
  isPlayer
}) => {
  const hpPercentage = (creature.currentHp / creature.maxHp) * 100;
  const hpColor = hpPercentage > 60 ? '#2ecc71' : hpPercentage > 30 ? '#f39c12' : '#e74c3c';

  return (
    <div className={`creature-display ${isPlayer ? 'player' : 'enemy'}`}>
      <div className="creature-info">
        <div className="creature-name">{creature.name}</div>
        <div className="creature-level">Lv. {creature.level}</div>
      </div>
      
      <div className="creature-sprite-container">
        <div className="creature-sprite-placeholder">
          {/* Sprite will be rendered by Phaser */}
          <div className="sprite-indicator">{creature.name.charAt(0)}</div>
        </div>
      </div>

      <div className="creature-stats">
        <div className="hp-bar-container">
          <div className="hp-label">
            HP: {creature.currentHp} / {creature.maxHp}
          </div>
          <div className="hp-bar">
            <div
              className="hp-fill"
              style={{
                width: `${hpPercentage}%`,
                backgroundColor: hpColor
              }}
            />
          </div>
        </div>

        {/* Buffs/Debuffs */}
        {(creature.activeBuffs.length > 0 || creature.activeDebuffs.length > 0) && (
          <div className="status-effects">
            {creature.activeBuffs.map((buff, index) => (
              <div key={`buff-${index}`} className="status-effect buff">
                +{buff.stat}
              </div>
            ))}
            {creature.activeDebuffs.map((debuff, index) => (
              <div key={`debuff-${index}`} className="status-effect debuff">
                -{debuff.stat}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
