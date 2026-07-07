import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';

interface WalkthroughStep {
  title: string;
  description: string;
}

interface WalkthroughProps {
  steps: WalkthroughStep[];
  onFinish: () => void;
}

export const Walkthrough: React.FC<WalkthroughProps> = ({ steps, onFinish }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 relative animate-fade-in">
        <button
          onClick={onFinish}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Close walkthrough"
        >
          <X size={18} />
        </button>
        <p className="text-xs font-medium text-primary-600 mb-1">
          Step {stepIndex + 1} of {steps.length}
        </p>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
        <p className="text-sm text-gray-600 mb-6">{step.description}</p>
        <div className="flex justify-between">
          <Button variant="ghost" size="sm" onClick={onFinish}>
            Skip
          </Button>
          <Button size="sm" onClick={() => (isLast ? onFinish() : setStepIndex((i) => i + 1))}>
            {isLast ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};
