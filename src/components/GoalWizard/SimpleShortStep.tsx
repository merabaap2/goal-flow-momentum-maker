import React, { useState } from 'react';
import { AppButton } from '../ui/AppButton';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, ArrowRight, CheckSquare } from 'lucide-react';

interface SimpleShortStepProps {
  bucketItem: string;
  mediumGoals: string[];
  onNext: (shortGoals: string[]) => void;
  onBack: () => void;
}

export const SimpleShortStep: React.FC<SimpleShortStepProps> = ({ 
  bucketItem, 
  mediumGoals, 
  onNext, 
  onBack 
}) => {
  const [shortGoals, setShortGoals] = useState<string[]>(['']);

  const addGoal = () => {
    if (shortGoals.length < 5) {
      setShortGoals([...shortGoals, '']);
    }
  };

  const removeGoal = (index: number) => {
    if (shortGoals.length > 1) {
      setShortGoals(shortGoals.filter((_, i) => i !== index));
    }
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...shortGoals];
    newGoals[index] = value;
    setShortGoals(newGoals);
  };

  const validGoals = shortGoals.filter(goal => goal.trim().length > 0);
  const canProceed = validGoals.length >= 1;

  const handleNext = () => {
    if (canProceed) {
      onNext(validGoals);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-5xl mb-4">📋</div>
        <h2 className="text-2xl font-bold text-[#374151]">Short-Term Actions</h2>
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <p className="text-sm text-green-800 font-medium">
            Your Dream: "{bucketItem}"
          </p>
        </div>
        <p className="text-gray-600 px-4">
          What short-term actions can you take in the next few weeks to move towards your goals?
        </p>
      </div>

      <div className="space-y-4">
        {shortGoals.map((goal, index) => (
          <div key={index} className="relative group">
            <Textarea
              placeholder={`Short-term action ${index + 1}...`}
              value={goal}
              onChange={(e) => updateGoal(index, e.target.value)}
              className="min-h-[80px] resize-none border-2 rounded-xl focus:border-[#2BD192] transition-all duration-200"
            />
            {shortGoals.length > 1 && (
              <button
                onClick={() => removeGoal(index)}
                className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {shortGoals.length < 5 && (
        <button
          onClick={addGoal}
          className="w-full p-4 border-2 border-dashed border-[#2BD192] rounded-xl text-[#2BD192] hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add another action</span>
        </button>
      )}

      <div className="flex justify-between pt-4">
        <AppButton
          onClick={onBack}
          variant="outline"
          size="lg"
        >
          Back
        </AppButton>
        <AppButton
          onClick={handleNext}
          disabled={!canProceed}
          size="lg"
        >
          <CheckSquare className="mr-2 h-4 w-4" />
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </AppButton>
      </div>
    </div>
  );
};