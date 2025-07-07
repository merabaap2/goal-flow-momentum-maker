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

  // Get all medium-term goals across all bucket items
  const allMediumTermGoals: string[] = [];
  Object.values(data.mediumTermGoals || {}).forEach(goals => {
    allMediumTermGoals.push(...goals);
  });

  useEffect(() => {
    // Initialize goals for each medium-term goal
    const initialGoals: { [key: string]: string[] } = {};
    allMediumTermGoals.forEach(mediumGoal => {
      if (!shortTermGoals[mediumGoal]) {
        initialGoals[mediumGoal] = [''];
      }
    });
    if (Object.keys(initialGoals).length > 0) {
      setShortTermGoals(prev => ({ ...prev, ...initialGoals }));
    }
  }, [allMediumTermGoals]);

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
      const prompt = `For the medium-term goal: "${mediumGoal}", what are 5 specific short-term actions someone can take in the next 3-6 months? Focus on practical, achievable steps that build momentum.`;
      
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

  const isValid = allMediumTermGoals.every(mediumGoal => {
    const goals = shortTermGoals[mediumGoal] || [];
    return goals.some(goal => goal.trim().length > 0);
  });

  const handleNext = () => {
    const cleanedGoals: { [key: string]: string[] } = {};
    Object.keys(shortTermGoals).forEach(mediumGoal => {
      cleanedGoals[mediumGoal] = shortTermGoals[mediumGoal].filter(goal => goal.trim().length > 0);
    });
    onNext(cleanedGoals);
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
        {allMediumTermGoals.map((mediumGoal, goalIndex) => (
          <Card key={goalIndex} className="border-2 border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-[#374151] mb-2">
                    🎯 {mediumGoal}
                  </CardTitle>
                </div>
                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => generateSuggestions(mediumGoal)}
                  disabled={isGeneratingSuggestions}
                  className="shrink-0"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {isGeneratingSuggestions ? 'Generating...' : 'Get Ideas'}
                </AppButton>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {suggestions[mediumGoal] && suggestions[mediumGoal].length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800 text-sm">AI Suggestions:</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {suggestions[mediumGoal].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => applySuggestion(mediumGoal, suggestion)}
                        className="text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm"
                      >
                        • {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {(shortTermGoals[mediumGoal] || []).map((goal, goalIndex) => (
                  <div key={goalIndex} className="relative group">
                    <Textarea
                      placeholder={`Short-term action ${goalIndex + 1} for "${mediumGoal}"...`}
                      value={goal}
                      onChange={(e) => updateGoal(mediumGoal, goalIndex, e.target.value)}
                      className={cn(
                        "min-h-[80px] resize-none border-2 rounded-lg focus:border-[#2BD192] transition-all duration-200",
                        goal.trim() && "border-[#2BD192] bg-green-50/50"
                      )}
                    />
                    {(shortTermGoals[mediumGoal] || []).length > 1 && (
                      <button
                        onClick={() => removeGoal(mediumGoal, goalIndex)}
                        className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => addGoal(mediumGoal)}
                className="w-full p-4 border-2 border-dashed border-[#2BD192] rounded-lg text-[#2BD192] hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add another short-term action</span>
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <AppButton variant="outline" onClick={onBack}>
          ← Back
        </AppButton>
        <AppButton
          onClick={handleNext}
          disabled={!isValid}
          size="lg"
        >
          Continue →
        </AppButton>
      </div>
    </div>
  );
};