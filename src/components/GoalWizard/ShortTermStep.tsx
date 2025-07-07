import React, { useState, useEffect } from 'react';
import { AppButton } from '../ui/AppButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Lightbulb, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WizardData } from './GoalWizard';
import { generateGeminiSuggestions } from '../../lib/gemini';

interface ShortTermStepProps {
  data: WizardData;
  onNext: (shortTermGoals: { [key: string]: string[] }) => void;
  onBack: () => void;
}

export const ShortTermStep: React.FC<ShortTermStepProps> = ({ data, onNext, onBack }) => {
  const [shortTermGoals, setShortTermGoals] = useState<{ [key: string]: string[] }>(
    data.shortTermGoals || {}
  );
  const [suggestions, setSuggestions] = useState<{ [key: string]: string[] }>({});
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  // Group medium-term goals by bucket list items
  const goalsByBucket: { [bucketItem: string]: string[] } = {};
  Object.entries(data.mediumTermGoals || {}).forEach(([bucketItem, goals]) => {
    goalsByBucket[bucketItem] = goals;
  });

  useEffect(() => {
    // Initialize goals for each medium-term goal
    const initialGoals: { [key: string]: string[] } = {};
    Object.values(goalsByBucket).flat().forEach(goal => {
      if (!shortTermGoals[goal]) {
        initialGoals[goal] = [''];
      }
    });
    if (Object.keys(initialGoals).length > 0) {
      setShortTermGoals(prev => ({ ...prev, ...initialGoals }));
    }
  }, [goalsByBucket]);

  const addGoal = (mediumGoal: string) => {
    setShortTermGoals(prev => ({
      ...prev,
      [mediumGoal]: [...(prev[mediumGoal] || []), '']
    }));
  };

  const removeGoal = (mediumGoal: string, index: number) => {
    setShortTermGoals(prev => ({
      ...prev,
      [mediumGoal]: prev[mediumGoal].filter((_, i) => i !== index)
    }));
  };

  const updateGoal = (mediumGoal: string, index: number, value: string) => {
    setShortTermGoals(prev => ({
      ...prev,
      [mediumGoal]: prev[mediumGoal].map((goal, i) => i === index ? value : goal)
    }));
  };

  const generateSuggestions = async (mediumGoal: string) => {
    setIsGeneratingSuggestions(true);
    try {
      const prompt = `For the medium-term goal: "${mediumGoal}", what are 3 specific DAILY actions someone can take to achieve this goal? Think of small, actionable habits that can be done every day or week. Focus on granular, specific actions that build toward the medium-term goal.`;
      
      const aiSuggestions = await generateGeminiSuggestions(prompt, `Medium-term goal: ${mediumGoal}`);
      
      if (aiSuggestions.length > 0) {
        setSuggestions(prev => ({
          ...prev,
          [mediumGoal]: aiSuggestions
        }));
      } else {
        const fallbackSuggestions = getSampleSuggestions(mediumGoal);
        setSuggestions(prev => ({
          ...prev,
          [mediumGoal]: fallbackSuggestions
        }));
      }
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      const fallbackSuggestions = getSampleSuggestions(mediumGoal);
      setSuggestions(prev => ({
        ...prev,
        [mediumGoal]: fallbackSuggestions
      }));
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const getSampleSuggestions = (mediumGoal: string): string[] => {
    const lowerCase = mediumGoal.toLowerCase();
    
    if (lowerCase.includes('save') || lowerCase.includes('money')) {
      return [
        'Create a detailed budget',
        'Set up automatic savings',
        'Cut unnecessary expenses',
        'Find additional income sources',
        'Track spending weekly'
      ];
    } else if (lowerCase.includes('fitness') || lowerCase.includes('exercise')) {
      return [
        'Join a gym or fitness program',
        'Set weekly workout schedule',
        'Track progress measurements',
        'Find workout buddy',
        'Plan healthy meal prep'
      ];
    } else if (lowerCase.includes('skill') || lowerCase.includes('learn')) {
      return [
        'Enroll in online courses',
        'Practice daily for 30 minutes',
        'Join relevant communities',
        'Find a mentor or coach',
        'Set monthly skill milestones'
      ];
    } else if (lowerCase.includes('network') || lowerCase.includes('connection')) {
      return [
        'Attend industry events',
        'Connect on LinkedIn weekly',
        'Join professional groups',
        'Schedule coffee meetings',
        'Offer help to others first'
      ];
    } else {
      return [
        'Break into 30-day milestones',
        'Create weekly action steps',
        'Set up tracking system',
        'Find accountability partner',
        'Schedule regular reviews'
      ];
    }
  };

  const applySuggestion = (mediumGoal: string, suggestion: string) => {
    const currentGoals = shortTermGoals[mediumGoal] || [];
    const emptyIndex = currentGoals.findIndex(goal => goal.trim() === '');
    
    if (emptyIndex !== -1) {
      updateGoal(mediumGoal, emptyIndex, suggestion);
    } else {
      setShortTermGoals(prev => ({
        ...prev,
        [mediumGoal]: [...currentGoals, suggestion]
      }));
    }
  };

  // Debug validation
  console.log('shortTermGoals:', shortTermGoals);
  console.log('Object.keys(shortTermGoals):', Object.keys(shortTermGoals));
  console.log('Object.values(shortTermGoals):', Object.values(shortTermGoals));
  
  const isValid = Object.keys(shortTermGoals).length > 0 && Object.values(shortTermGoals).some(goals => 
    goals.some(goal => goal.trim().length > 0)
  );
  
  console.log('isValid:', isValid);

  const handleNext = () => {
    // Show a confirmation dialog or just update data without navigation
    const cleanedGoals: { [key: string]: string[] } = {};
    Object.keys(shortTermGoals).forEach(mediumGoal => {
      cleanedGoals[mediumGoal] = shortTermGoals[mediumGoal].filter(goal => goal.trim().length > 0);
    });
    // Just update the data, don't navigate to next step
    // onNext(cleanedGoals);
    console.log('Short-term goals saved:', cleanedGoals);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-2xl font-bold text-[#374151]">What short-term actions will move you forward?</h2>
        <p className="text-gray-600 leading-relaxed">
          For each medium-term goal, let's identify specific short-term actions you can take in the next 3-6 months to make progress.
        </p>
      </div>

      <div className="space-y-6">
        {Object.values(goalsByBucket).flat().map((mediumGoal, goalIndex) => (
          <div key={goalIndex} className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="text-yellow-500 text-lg mt-0.5">🎯</div>
              <div className="flex-1">
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                  {mediumGoal}
                </p>
              </div>
            </div>

            {suggestions[mediumGoal] && suggestions[mediumGoal].length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="h-3 w-3 text-blue-600" />
                  <span className="font-medium text-blue-800 text-xs">Quick Ideas:</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {suggestions[mediumGoal].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => applySuggestion(mediumGoal, suggestion)}
                      className="text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-xs leading-relaxed"
                    >
                      <div className="line-clamp-2">• {suggestion}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {(shortTermGoals[mediumGoal] || []).map((goal, shortGoalIndex) => (
                <div key={shortGoalIndex} className="relative group">
                  <Textarea
                    placeholder={`Short-term action ${shortGoalIndex + 1} for "${mediumGoal}"...`}
                    value={goal}
                    onChange={(e) => updateGoal(mediumGoal, shortGoalIndex, e.target.value)}
                    className={cn(
                      "min-h-[60px] resize-none border-2 rounded-lg focus:border-[#2BD192] transition-all duration-200 text-sm",
                      goal.trim() && "border-[#2BD192] bg-green-50/50"
                    )}
                  />
                  {(shortTermGoals[mediumGoal] || []).length > 1 && (
                    <button
                      onClick={() => removeGoal(mediumGoal, shortGoalIndex)}
                      className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => addGoal(mediumGoal)}
              className="w-full p-3 border-2 border-dashed border-[#2BD192] rounded-lg text-[#2BD192] hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
            >
              <Plus className="h-3 w-3" />
              <span>Add short-term action</span>
            </button>
          </div>
        ))}
      </div>

      {/* Navigation buttons at the end of content */}
      <div className="pt-6 pb-8">
        <div className="flex justify-between gap-3 max-w-[356px] mx-auto">
          <AppButton variant="outline" onClick={onBack} className="flex-1 h-12 border-2 text-sm">
            ← Back
          </AppButton>
          <AppButton
            onClick={handleNext}
            disabled={!isValid}
            className="flex-1 h-12 text-sm"
          >
            Continue →
          </AppButton>
        </div>
      </div>
    </div>
  );
};