import React, { useState } from 'react';
import { AppButton } from '../ui/AppButton';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ArrowRight, RotateCcw, CheckCircle, Lightbulb } from 'lucide-react';
import { generateGeminiSuggestions } from '../../lib/gemini';

interface SimpleDailyStepProps {
  bucketItem: string;
  timeline: number;
  onNext: (dailyHabits: string[]) => void;
  onBack: () => void;
}

export const SimpleDailyStep: React.FC<SimpleDailyStepProps> = ({ 
  bucketItem, 
  timeline,
  onNext, 
  onBack 
}) => {
  const [dailyHabits, setDailyHabits] = useState<string[]>(['']);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const generateSuggestions = async () => {
    setIsGenerating(true);
    try {
      const prompt = `For someone who wants to "${bucketItem}" over ${timeline} years, suggest 3 small daily habits (5-30 minutes each) that will build towards this goal.

Return ONLY a JSON array of strings like this:
["habit 1", "habit 2", "habit 3"]

Focus on simple, consistent habits specific to "${bucketItem}".`;
      
      const aiSuggestions = await generateGeminiSuggestions(prompt);
      setSuggestions(aiSuggestions);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      // Provide contextual fallback based on the bucket item
      const fallbacks = generateContextualFallbacks(bucketItem);
      setSuggestions(fallbacks);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateContextualFallbacks = (dream: string): string[] => {
    const dreamLower = dream.toLowerCase();
    
    if (dreamLower.includes('travel') || dreamLower.includes('world')) {
      return [
        'Save $20 daily in a dedicated travel fund',
        'Learn 10 new words in local languages daily',
        'Research one destination for 15 minutes daily'
      ];
    } else if (dreamLower.includes('business') || dreamLower.includes('startup')) {
      return [
        'Read business/industry news for 20 minutes daily',
        'Work on business plan for 30 minutes daily',
        'Network with one new person weekly'
      ];
    } else if (dreamLower.includes('learn') || dreamLower.includes('skill')) {
      return [
        'Practice the skill for 30 minutes daily',
        'Read about the topic for 15 minutes daily',
        'Connect with one practitioner weekly'
      ];
    } else if (dreamLower.includes('health') || dreamLower.includes('fitness')) {
      return [
        'Exercise for 30 minutes daily',
        'Track meals and habits daily',
        'Read health tips for 10 minutes daily'
      ];
    } else {
      return [
        `Spend 15 minutes daily learning about ${dream}`,
        `Save money daily towards ${dream}`,
        `Plan steps for ${dream} for 10 minutes daily`
      ];
    }
  };

  const toggleSuggestionSelection = (suggestion: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(suggestion)
        ? prev.filter(s => s !== suggestion)
        : [...prev, suggestion]
    );
  };

  const applySelectedSuggestions = () => {
    setDailyHabits(prev => {
      let updatedHabits = [...prev];
      
      selectedSuggestions.forEach(suggestion => {
        const emptyIndex = updatedHabits.findIndex(habit => habit.trim() === '');
        if (emptyIndex !== -1) {
          updatedHabits[emptyIndex] = suggestion;
        } else if (updatedHabits.length < 5) {
          updatedHabits.push(suggestion);
        }
      });
      
      return updatedHabits;
    });
    closeSuggestions();
  };

  const closeSuggestions = () => {
    setSuggestions([]);
    setSelectedSuggestions([]);
  };

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
          What daily habits will keep you on track towards achieving your dream over {timeline} years? Small consistent actions create big results.
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
        <div className="space-y-3">
          <button
            onClick={addHabit}
            className="w-full p-4 border-2 border-dashed border-[#2BD192] rounded-xl text-[#2BD192] hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add another habit</span>
          </button>
          
          <button
            onClick={generateSuggestions}
            disabled={isGenerating}
            className="w-full p-4 border-2 border-dashed border-yellow-400 rounded-xl text-yellow-600 hover:bg-yellow-50 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Lightbulb className="h-5 w-5" />
            <span>{isGenerating ? 'Getting Ideas...' : 'Get Ideas'}</span>
          </button>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-yellow-800 text-sm flex items-center">
              <Lightbulb className="mr-2 h-4 w-4" />
              AI Suggestions for "{bucketItem}":
            </h3>
            <button 
              onClick={closeSuggestions}
              className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 mb-4">
            {suggestions.map((suggestion, index) => {
              const isSelected = selectedSuggestions.includes(suggestion);
              return (
                <button 
                  key={index} 
                  onClick={() => toggleSuggestionSelection(suggestion)} 
                  className={`w-full text-left p-3 rounded-lg transition-colors border ${
                    isSelected 
                      ? 'bg-yellow-200 border-yellow-400 text-yellow-800' 
                      : 'bg-white border-yellow-200 hover:bg-yellow-100'
                  }`}
                >
                  <span className="text-sm">
                    {isSelected ? '✓ ' : '• '}{suggestion}
                  </span>
                </button>
              );
            })}
          </div>
          {selectedSuggestions.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={applySelectedSuggestions}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
              >
                Apply Selected ({selectedSuggestions.length})
              </button>
              <button
                onClick={closeSuggestions}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>
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