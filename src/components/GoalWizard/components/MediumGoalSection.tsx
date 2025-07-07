import React, { useState } from 'react';
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
  const [isGoalExpanded, setIsGoalExpanded] = useState(false);
  const isLongGoal = mediumGoal.length > 50; // Check if goal text is long

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <CardTitle 
            className={`text-lg text-[#374151] mb-2 cursor-pointer hover:text-[#2BD192] transition-colors ${
              isGoalExpanded || !isLongGoal ? '' : 'line-clamp-2'
            }`}
            onClick={() => isLongGoal && setIsGoalExpanded(!isGoalExpanded)}
            title={isLongGoal ? "Click to expand/collapse" : undefined}
          >
            🎯 {mediumGoal}
          </CardTitle>
          {isLongGoal && (
            <button
              onClick={() => setIsGoalExpanded(!isGoalExpanded)}
              className="text-xs text-gray-500 hover:text-[#2BD192] transition-colors"
            >
              {isGoalExpanded ? "Show less" : "Show more..."}
            </button>
          )}
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