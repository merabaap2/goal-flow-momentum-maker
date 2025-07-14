import React, { useState } from 'react';
import { AppButton } from '../ui/AppButton';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, ArrowRight, CheckSquare, Lightbulb } from 'lucide-react';
import { generateGeminiSuggestions } from '../../lib/gemini';

interface SimpleShortStepProps {
  bucketItem: string;
  timeline: number;
  mediumGoals: string[];
  onNext: (shortGoals: string[]) => void;
  onBack: () => void;
}

export const SimpleShortStep: React.FC<SimpleShortStepProps> = ({ 
  bucketItem, 
  timeline,
  mediumGoals, 
  onNext, 
  onBack 
}) => {
  const [shortGoals, setShortGoals] = useState<string[]>(['']);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const generateSuggestions = async () => {
    setIsGenerating(true);
    try {
      const mediumGoalContext = mediumGoals.length > 0 ? ` The medium-term goals are: ${mediumGoals.join(', ')}.` : '';
      const prompt = `For someone who wants to "${bucketItem}" over ${timeline} years${mediumGoalContext} Suggest 3 specific short-term actions (1-12 months) they can take now to make progress.

Return ONLY a JSON array of strings like this:
["action 1", "action 2", "action 3"]

Focus on immediate, actionable steps specific to "${bucketItem}".`;
      
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
        'Get passport and research visa requirements',
        'Start saving money and create travel budget',
        'Research the 7 wonders and plan optimal route'
      ];
    } else if (dreamLower.includes('business') || dreamLower.includes('startup')) {
      return [
        'Write a business plan draft',
        'Research your target market and competition',
        'Network with other entrepreneurs and mentors'
      ];
    } else if (dreamLower.includes('learn') || dreamLower.includes('skill')) {
      return [
        'Enroll in an online course or find learning resources',
        'Practice for 30 minutes daily',
        'Join communities of people learning the same skill'
      ];
    } else {
      return [
        `Research the specific requirements for ${dream}`,
        `Make a detailed plan with timelines`,
        `Connect with people who have achieved ${dream}`
      ];
    }
  };

  const applySuggestion = (suggestion: string) => {
    const emptyIndex = shortGoals.findIndex(goal => goal.trim() === '');
    if (emptyIndex !== -1) {
      updateGoal(emptyIndex, suggestion);
    } else if (shortGoals.length < 5) {
      setShortGoals([...shortGoals, suggestion]);
    }
    setSuggestions([]);
  };

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
          What short-term actions can you take in the next 1-3 months to move towards your goals within your {timeline}-year timeline?
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
        <div className="space-y-3">
          <button
            onClick={addGoal}
            className="w-full p-4 border-2 border-dashed border-[#2BD192] rounded-xl text-[#2BD192] hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add another action</span>
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
          <h3 className="font-bold text-yellow-800 text-sm mb-3 flex items-center">
            <Lightbulb className="mr-2 h-4 w-4" />
            AI Suggestions for "{bucketItem}":
          </h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => applySuggestion(suggestion)}
                className="w-full text-left p-3 bg-white rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-200"
              >
                <span className="text-sm text-gray-700">• {suggestion}</span>
              </button>
            ))}
          </div>
        </div>
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