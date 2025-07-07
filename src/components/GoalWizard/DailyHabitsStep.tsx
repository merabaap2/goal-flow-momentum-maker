import React, { useState, useEffect } from 'react';
import { AppButton } from '../ui/AppButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Lightbulb, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WizardData } from './GoalWizard';
import { generateGeminiSuggestions } from '../../lib/gemini';

interface DailyHabitsStepProps {
  data: WizardData;
  onNext: (dailyHabits: { [key: string]: string[] }) => void;
  onBack: () => void;
}

export const DailyHabitsStep: React.FC<DailyHabitsStepProps> = ({ data, onNext, onBack }) => {
  const [dailyHabits, setDailyHabits] = useState<{ [key: string]: string[] }>(
    data.dailyHabits || {}
  );
  const [suggestions, setSuggestions] = useState<{ [key: string]: string[] }>({});
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  // Get all medium-term goals to create habits for
  const allMediumTermGoals: string[] = [];
  Object.values(data.mediumTermGoals || {}).forEach(goals => {
    allMediumTermGoals.push(...goals);
  });

  useEffect(() => {
    const initialHabits: { [key: string]: string[] } = {};
    allMediumTermGoals.forEach(mediumGoal => {
      if (!dailyHabits[mediumGoal]) {
        initialHabits[mediumGoal] = [''];
      }
    });
    if (Object.keys(initialHabits).length > 0) {
      setDailyHabits(prev => ({ ...prev, ...initialHabits }));
    }
  }, [allMediumTermGoals]);

  const addHabit = (mediumGoal: string) => {
    setDailyHabits(prev => ({
      ...prev,
      [mediumGoal]: [...(prev[mediumGoal] || []), '']
    }));
  };

  const removeHabit = (mediumGoal: string, index: number) => {
    setDailyHabits(prev => ({
      ...prev,
      [mediumGoal]: prev[mediumGoal].filter((_, i) => i !== index)
    }));
  };

  const updateHabit = (mediumGoal: string, index: number, value: string) => {
    setDailyHabits(prev => ({
      ...prev,
      [mediumGoal]: prev[mediumGoal].map((habit, i) => i === index ? value : habit)
    }));
  };

  const generateSuggestions = async (mediumGoal: string) => {
    setIsGeneratingSuggestions(true);
    try {
      const prompt = `For the goal: "${mediumGoal}", what are 5 small daily habits someone can do? Focus on micro-habits that take 5-30 minutes and build momentum. Be specific with actions like "Save $5 daily" or "Read for 15 minutes".`;
      
      const aiSuggestions = await generateGeminiSuggestions(prompt, `Goal context: ${mediumGoal}`);
      
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
        'Save $10 daily',
        'Review expenses for 5 minutes',
        'Cook at home instead of ordering',
        'Compare prices before buying',
        'Put loose change in savings jar'
      ];
    } else if (lowerCase.includes('fitness') || lowerCase.includes('exercise')) {
      return [
        'Do 20 minutes of exercise',
        'Take 8,000 steps',
        'Drink 8 glasses of water',
        'Do 10 push-ups',
        'Stretch for 10 minutes'
      ];
    } else if (lowerCase.includes('skill') || lowerCase.includes('learn')) {
      return [
        'Study for 30 minutes',
        'Practice new skill for 15 minutes',
        'Read industry articles for 10 minutes',
        'Watch educational videos',
        'Take notes on key learnings'
      ];
    } else if (lowerCase.includes('network') || lowerCase.includes('connection')) {
      return [
        'Send one connection message',
        'Comment on 3 LinkedIn posts',
        'Reach out to one contact',
        'Share valuable content',
        'Join one online discussion'
      ];
    } else if (lowerCase.includes('travel') || lowerCase.includes('explore')) {
      return [
        'Research one destination for 15 minutes',
        'Save $5 for travel fund',
        'Learn 5 new words in target language',
        'Read travel blogs',
        'Plan one activity for future trip'
      ];
    } else {
      return [
        'Spend 15 minutes on this goal',
        'Take one small action',
        'Review progress for 5 minutes',
        'Read about best practices',
        'Plan tomorrow\'s actions'
      ];
    }
  };

  const applySuggestion = (mediumGoal: string, suggestion: string) => {
    const currentHabits = dailyHabits[mediumGoal] || [];
    const emptyIndex = currentHabits.findIndex(habit => habit.trim() === '');
    
    if (emptyIndex !== -1) {
      updateHabit(mediumGoal, emptyIndex, suggestion);
    } else {
      setDailyHabits(prev => ({
        ...prev,
        [mediumGoal]: [...currentHabits, suggestion]
      }));
    }
  };

  const isValid = allMediumTermGoals.every(mediumGoal => {
    const habits = dailyHabits[mediumGoal] || [];
    return habits.some(habit => habit.trim().length > 0);
  });

  const handleNext = () => {
    const cleanedHabits: { [key: string]: string[] } = {};
    Object.keys(dailyHabits).forEach(mediumGoal => {
      cleanedHabits[mediumGoal] = dailyHabits[mediumGoal].filter(habit => habit.trim().length > 0);
    });
    onNext(cleanedHabits);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="text-6xl mb-4">🔄</div>
        <h2 className="text-2xl font-bold text-[#374151]">What daily habits will keep you on track?</h2>
        <p className="text-gray-600 leading-relaxed">
          Success comes from consistent daily actions. For each medium-term goal, let's create small daily habits that will compound over time.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">💡</div>
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-2">Make habits SMALL and SPECIFIC:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div>✅ "Save $5 daily"</div>
              <div>❌ "Save money"</div>
              <div>✅ "Exercise for 15 minutes"</div>
              <div>❌ "Get fit"</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="border-2 border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-[#374151]">Daily Habits for Your Goals</CardTitle>
            <p className="text-gray-600 text-sm">Create small daily habits that will help you achieve your medium-term goals.</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {allMediumTermGoals.map((mediumGoal, goalIndex) => (
              <div key={goalIndex} className="space-y-4">
                <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-100">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-yellow-500 text-lg mt-0.5">🎯</div>
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-[#374151] line-clamp-2">
                        {mediumGoal}
                      </h3>
                    </div>
                  </div>
                  <AppButton
                    variant="outline"
                    size="sm"
                    onClick={() => generateSuggestions(mediumGoal)}
                    disabled={isGeneratingSuggestions}
                    className="shrink-0 border-yellow-500 hover:bg-yellow-50"
                  >
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                  </AppButton>
                </div>

                {suggestions[mediumGoal] && suggestions[mediumGoal].length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 ml-8">
                    <div className="flex items-center space-x-2 mb-3">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800 text-sm">AI Habit Suggestions:</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {suggestions[mediumGoal].map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => applySuggestion(mediumGoal, suggestion)}
                          className="text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm line-clamp-2"
                        >
                          • {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3 ml-8">
                  {(dailyHabits[mediumGoal] || []).map((habit, habitIndex) => (
                    <div key={habitIndex} className="relative group">
                      <Input
                        placeholder={`Daily habit ${habitIndex + 1} for "${mediumGoal}"...`}
                        value={habit}
                        onChange={(e) => updateHabit(mediumGoal, habitIndex, e.target.value)}
                        className={cn(
                          "h-12 border-2 rounded-lg focus:border-[#2BD192] transition-all duration-200",
                          habit.trim() && "border-[#2BD192] bg-green-50/50"
                        )}
                      />
                      {(dailyHabits[mediumGoal] || []).length > 1 && (
                        <button
                          onClick={() => removeHabit(mediumGoal, habitIndex)}
                          className="absolute top-3 right-3 p-1 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => addHabit(mediumGoal)}
                  className="w-full ml-8 p-4 border-2 border-dashed border-[#2BD192] rounded-lg text-[#2BD192] hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-2"
                  style={{ width: 'calc(100% - 2rem)' }}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add another daily habit</span>
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
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