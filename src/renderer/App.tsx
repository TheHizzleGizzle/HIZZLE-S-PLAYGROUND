/**
 * Main App Component
 * Coordinates React UI and Phaser game
 */

import React, { useEffect, useRef } from 'react';
import { GameManager } from './game/GameManager';
import './App.css';

const App: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameManagerRef = useRef<GameManager | null>(null);

  useEffect(() => {
    if (gameContainerRef.current && !gameManagerRef.current) {
      gameManagerRef.current = new GameManager(gameContainerRef.current);
    }

    return () => {
      if (gameManagerRef.current) {
        gameManagerRef.current.destroy();
        gameManagerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="app">
      <div ref={gameContainerRef} id="phaser-game" />
    </div>
  );
};

export default App;
