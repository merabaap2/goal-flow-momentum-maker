import React, { useState } from 'react';
import { AppButton } from '../ui/AppButton';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, ArrowRight, Target, Lightbulb } from 'lucide-react';
import { generateGeminiSuggestions } from '../../lib/gemini';
interface SimpleMediumStepProps {
  bucketItem: string;
  timeline: number;
  onNext: (mediumGoals: string[]) => void;
  onBack: () => void;
}
export const SimpleMediumStep: React.FC<SimpleMediumStepProps> = ({
  bucketItem,
  timeline,
  onNext,
  onBack
}) => {
  const [mediumGoals, setMediumGoals] = useState<string[]>(['']);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const addGoal = () => {
    if (mediumGoals.length < 3) {
      setMediumGoals([...mediumGoals, '']);
    }
  };
  const removeGoal = (index: number) => {
    if (mediumGoals.length > 1) {
      setMediumGoals(mediumGoals.filter((_, i) => i !== index));
    }
  };
  const updateGoal = (index: number, value: string) => {
    const newGoals = [...mediumGoals];
    newGoals[index] = value;
    setMediumGoals(newGoals);
  };
  const validGoals = mediumGoals.filter(goal => goal.trim().length > 0);
  const canProceed = validGoals.length >= 1;
  const generateSuggestions = async () => {
    setIsGenerating(true);
    try {
      const prompt = `For the bucket list dream: "${bucketItem}" with a ${timeline}-year timeline, what are 3 medium-term goals (6 months to 2 years) that will help achieve this dream? Consider the timeline and focus on specific, actionable milestones that build toward the final goal.`;
      const aiSuggestions = await generateGeminiSuggestions(prompt, `User's dream: ${bucketItem}, Timeline: ${timeline} years`);
      setSuggestions(aiSuggestions);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      setSuggestions(['Research and plan the first steps toward your dream', 'Build the necessary skills and knowledge base', 'Create a network of people who share similar aspirations']);
    } finally {
      setIsGenerating(false);
    }
  };
  const applySuggestion = (suggestion: string) => {
    const emptyIndex = mediumGoals.findIndex(goal => goal.trim() === '');
    if (emptyIndex !== -1) {
      updateGoal(emptyIndex, suggestion);
    } else if (mediumGoals.length < 3) {
      setMediumGoals([...mediumGoals, suggestion]);
    }
    setSuggestions([]);
  };
  const handleNext = () => {
    if (canProceed) {
      onNext(validGoals);
    }
  };
  return <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-5xl mb-4">🎯</div>
        <h2 className="text-2xl font-bold text-[#374151]">Medium-Term Goals</h2>
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <p className="text-sm text-green-800 font-medium">
            Your Dream: "{bucketItem}"
          </p>
        </div>
        <p className="text-gray-600 px-4">
          What medium-term goals will help you achieve this dream over {timeline} years? Think of milestones that could take 6 months to 2 years.
        </p>
      </div>

      <div className="space-y-4">
        {mediumGoals.map((goal, index) => <div key={index} className="relative group">
            <Textarea placeholder={`Medium-term goal ${index + 1}...`} value={goal} onChange={e => updateGoal(index, e.target.value)} className="min-h-[80px] resize-none border-2 rounded-xl focus:border-[#2BD192] transition-all duration-200" />
            {mediumGoals.length > 1 && <button onClick={() => removeGoal(index)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200">
                <Trash2 className="h-4 w-4" />
              </button>}
          </div>)}
      </div>

      {mediumGoals.length < 3 && <div className="space-y-3">
          <button onClick={addGoal} className="w-full p-4 border-2 border-dashed border-[#2BD192] rounded-xl text-[#2BD192] hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add another goal</span>
          </button>
          
          <button onClick={generateSuggestions} disabled={isGenerating} className="w-full p-4 border-2 border-dashed border-yellow-400 rounded-xl text-yellow-600 hover:bg-yellow-50 transition-all duration-200 flex items-center justify-center space-x-2">
            <Lightbulb className="h-5 w-5" />
            <span>{isGenerating ? 'Getting Ideas...' : 'Get Ideas'}</span>
          </button>
        </div>}

      {suggestions.length > 0 && <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h3 className="font-bold text-yellow-800 text-sm mb-3 flex items-center">
            <Lightbulb className="mr-2 h-4 w-4" />
            AI Suggestions for "{bucketItem}":
          </h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => <button key={index} onClick={() => applySuggestion(suggestion)} className="w-full text-left p-3 bg-white rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-200">
                <span className="text-sm text-gray-700">• {suggestion}</span>
              </button>)}
          </div>
        </div>}

      <div className="flex justify-between pt-4 mx-0 my-0">
        <AppButton onClick={onBack} variant="outline" size="lg">
          Back
        </AppButton>
        <AppButton onClick={handleNext} disabled={!canProceed} size="lg">
          <Target className="mr-2 h-4 w-4" />
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </AppButton>
      </div>
    </div>;
};