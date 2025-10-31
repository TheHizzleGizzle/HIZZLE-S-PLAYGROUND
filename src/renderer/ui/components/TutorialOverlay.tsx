/**
 * Tutorial Overlay Component
 * Displays tutorial steps with code examples
 */

import React, { useState } from 'react';
import { TutorialSystem, TutorialStep } from '../../game/core/TutorialSystem';
import './TutorialOverlay.css';

interface TutorialOverlayProps {
  currentStepId?: string;
  onComplete: (stepId: string) => void;
  onClose: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  currentStepId,
  onComplete,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState<TutorialStep | null>(
    currentStepId ? TutorialSystem.getStep(currentStepId) || null : null
  );

  if (!currentStep) {
    // Show available tutorials
    const available = TutorialSystem.getAvailableSteps();
    if (available.length === 0) {
      return null;
    }
    setCurrentStep(available[0]);
    return null;
  }

  const handleNext = () => {
    const available = TutorialSystem.getAvailableSteps();
    const currentIndex = available.findIndex(s => s.id === currentStep.id);
    
    if (currentIndex < available.length - 1) {
      setCurrentStep(available[currentIndex + 1]);
    } else {
      onClose();
    }
  };

  const handleComplete = () => {
    TutorialSystem.completeStep(currentStep.id);
    onComplete(currentStep.id);
    handleNext();
  };

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-content">
        <div className="tutorial-header">
          <h2 className="tutorial-title">{currentStep.title}</h2>
          <button className="tutorial-close" onClick={onClose}>?</button>
        </div>
        
        <div className="tutorial-body">
          <p className="tutorial-description">{currentStep.description}</p>
          
          {currentStep.codeExample && (
            <div className="tutorial-code">
              <div className="code-label">Example Code:</div>
              <pre className="code-block">
                <code>{currentStep.codeExample}</code>
              </pre>
            </div>
          )}
        </div>
        
        <div className="tutorial-footer">
          <button className="tutorial-button skip" onClick={onClose}>
            Skip Tutorial
          </button>
          <button className="tutorial-button complete" onClick={handleComplete}>
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
