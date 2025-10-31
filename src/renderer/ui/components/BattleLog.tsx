/**
 * Battle Log Component
 * Displays battle messages and code execution feedback
 */

import React from 'react';
import { BattleLogEntry } from '@shared/types/Battle';
import './BattleLog.css';

interface BattleLogProps {
  log: BattleLogEntry[];
}

export const BattleLog: React.FC<BattleLogProps> = ({ log }) => {
  return (
    <div className="battle-log">
      <div className="battle-log-title">Battle Log</div>
      <div className="battle-log-content">
        {log.length === 0 ? (
          <div className="log-entry system">Battle started!</div>
        ) : (
          log.map((entry, index) => (
            <div
              key={index}
              className={`log-entry ${entry.type}`}
            >
              <span className="log-turn">Turn {entry.turn}:</span>
              <span className="log-message">{entry.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
