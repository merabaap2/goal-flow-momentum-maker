import React from 'react';
import { AppButton } from '@/components/ui/AppButton';
import { CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { HabitSuggestions } from './HabitSuggestions';
import { HabitInput } from './HabitInput';
import { AddHabitButton } from './AddHabitButton';

interface MediumGoalSectionProps {
  mediumGoal: string;
  habits: string[];
  suggestions: string[];
  isGeneratingSuggestions: boolean;
  onGenerateSuggestions: () => void;
  onApplySuggestion: (suggestion: string) => void;
  onUpdateHabit: (index: number, value: string) => void;
  onRemoveHabit: (index: number) => void;
  onAddHabit: () => void;
}

export const MediumGoalSection: React.FC<MediumGoalSectionProps> = ({
  mediumGoal,
  habits,
  suggestions,
  isGeneratingSuggestions,
  onGenerateSuggestions,
  onApplySuggestion,
  onUpdateHabit,
  onRemoveHabit,
  onAddHabit,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <CardTitle className="text-lg text-[#374151] mb-2 line-clamp-2">
            🎯 {mediumGoal}
          </CardTitle>
        </div>
        <AppButton
          variant="outline"
          size="sm"
          onClick={onGenerateSuggestions}
          disabled={isGeneratingSuggestions}
          className="shrink-0 border-yellow-500 hover:bg-yellow-50 ml-4"
        >
          <Lightbulb className="h-4 w-4 text-yellow-500" />
        </AppButton>
      </div>

      <HabitSuggestions
        suggestions={suggestions}
        onApplySuggestion={onApplySuggestion}
      />

      <div className="space-y-3">
        {habits.map((habit, habitIndex) => (
          <HabitInput
            key={habitIndex}
            value={habit}
            placeholder={`Daily habit ${habitIndex + 1}...`}
            onChange={(value) => onUpdateHabit(habitIndex, value)}
            onRemove={() => onRemoveHabit(habitIndex)}
            showRemove={habits.length > 1}
          />
        ))}
      </div>

      <AddHabitButton onClick={onAddHabit} />
    </div>
  );
};