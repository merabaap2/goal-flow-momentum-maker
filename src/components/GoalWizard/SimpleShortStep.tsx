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
      const enabler = mediumGoals.length > 0 ? mediumGoals[0] : 'the medium-term milestone';
      const prompt = `You are a tactical goal-setting assistant inside the **RDM Goal-Filter** app.

## Context
OVERALL_ETA_YEARS = ${timeline}
DREAM = "${bucketItem}"
ENABLER = {
  "name": "${enabler}",
  "duration_years": ${Math.ceil(timeline * 0.5)}
}

## Task
Suggest **2-3 Short-Term Goals** that:

1. Can be **fully completed within 12 months** (≤ 1 year, ideally 3-9 months).  
2. Logically advance the ENABLER and therefore the DREAM.  
3. Are concrete, measurable, and realistic for a motivated adult.  
4. Require no backend context (offline-first).  
5. Do **not** overlap with other suggested short-term goals for the same enabler.

If you cannot propose meaningful goals, return an empty list.

## Output format (JSON only)
\`\`\`json
{
  "enabler": "${enabler}",
  "short_goals": [
    {
      "detail": "<concise project/action>",
      "duration_months": N,
      "why_it_helps": "<≤ 15 words>"
    }
  ]
}
\`\`\``;
      
      const response = await generateGeminiSuggestions(prompt);
      
      // Parse the structured response and extract just the details
      try {
        const data = JSON.parse(response[0] || '{}');
        if (data.short_goals && Array.isArray(data.short_goals)) {
          const goalDetails = data.short_goals.map((goal: any) => goal.detail);
          setSuggestions(goalDetails.slice(0, 3));
        } else {
          throw new Error('Invalid format');
        }
      } catch (parseError) {
        // Fallback to the raw response if parsing fails
        setSuggestions(response.slice(0, 3));
      }
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      setSuggestions([
        'Research and gather information about your dream',
        'Create a detailed plan with specific deadlines',
        'Take the first concrete step toward your goal'
      ]);
    } finally {
      setIsGenerating(false);
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