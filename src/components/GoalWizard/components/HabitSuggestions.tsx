import React from 'react';
import { Sparkles } from 'lucide-react';

interface HabitSuggestionsProps {
  suggestions: string[];
  onApplySuggestion: (suggestion: string) => void;
}

export const HabitSuggestions: React.FC<HabitSuggestionsProps> = ({
  suggestions,
  onApplySuggestion,
}) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Sparkles className="h-4 w-4 text-blue-600" />
        <span className="font-medium text-blue-800 text-sm">AI Habit Suggestions:</span>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onApplySuggestion(suggestion)}
            className="text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm"
          >
            • {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};