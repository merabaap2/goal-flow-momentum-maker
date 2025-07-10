import React, { useState } from 'react';
import { AppButton } from '../ui/AppButton';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ArrowRight, RotateCcw, CheckCircle } from 'lucide-react';

interface SimpleDailyStepProps {
  bucketItem: string;
  onNext: (dailyHabits: string[]) => void;
  onBack: () => void;
}

export const SimpleDailyStep: React.FC<SimpleDailyStepProps> = ({ 
  bucketItem, 
  onNext, 
  onBack 
}) => {
  const [dailyHabits, setDailyHabits] = useState<string[]>(['']);

  const addHabit = () => {
    if (dailyHabits.length < 5) {
      setDailyHabits([...dailyHabits, '']);
    }
  };

  const removeHabit = (index: number) => {
    if (dailyHabits.length > 1) {
      setDailyHabits(dailyHabits.filter((_, i) => i !== index));
    }
  };

  const updateHabit = (index: number, value: string) => {
    const newHabits = [...dailyHabits];
    newHabits[index] = value;
    setDailyHabits(newHabits);
  };

  const validHabits = dailyHabits.filter(habit => habit.trim().length > 0);
  const canProceed = validHabits.length >= 1;

  const handleNext = () => {
    if (canProceed) {
      onNext(validHabits);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-5xl mb-4">🔄</div>
        <h2 className="text-2xl font-bold text-[#374151]">Daily Habits</h2>
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <p className="text-sm text-green-800 font-medium">
            Your Dream: "{bucketItem}"
          </p>
        </div>
        <p className="text-gray-600 px-4">
          What daily habits will keep you on track towards achieving your dream? Small consistent actions create big results.
        </p>
      </div>

      <div className="space-y-4">
        {dailyHabits.map((habit, index) => (
          <div key={index} className="relative group">
            <Input
              placeholder={`Daily habit ${index + 1}...`}
              value={habit}
              onChange={(e) => updateHabit(index, e.target.value)}
              className="h-12 border-2 rounded-xl focus:border-[#2BD192] transition-all duration-200"
            />
            {dailyHabits.length > 1 && (
              <button
                onClick={() => removeHabit(index)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 p-1 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {dailyHabits.length < 5 && (
        <button
          onClick={addHabit}
          className="w-full p-4 border-2 border-dashed border-[#2BD192] rounded-xl text-[#2BD192] hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add another habit</span>
        </button>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-xs text-blue-800 text-center">
          💡 Remember: Small daily actions compound into extraordinary results over time!
        </p>
      </div>

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
          <CheckCircle className="mr-2 h-4 w-4" />
          Complete Setup
          <ArrowRight className="ml-2 h-4 w-4" />
        </AppButton>
      </div>
    </div>
  );
};