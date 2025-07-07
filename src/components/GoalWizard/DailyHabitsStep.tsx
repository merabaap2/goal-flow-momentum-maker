import React, { useState, useEffect } from 'react';
import { AppButton } from '../ui/AppButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WizardData } from './GoalWizard';
import { generateGeminiSuggestions } from '../../lib/gemini';
import { MediumGoalSection } from './components/MediumGoalSection';

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

      <Card className="border-2 border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-[#374151]">Daily Habits for Your Goals</CardTitle>
          <p className="text-gray-600 text-sm">Create small daily habits that will help you achieve your medium-term goals.</p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {allMediumTermGoals.map((mediumGoal, goalIndex) => (
            <MediumGoalSection
              key={goalIndex}
              mediumGoal={mediumGoal}
              habits={dailyHabits[mediumGoal] || []}
              suggestions={suggestions[mediumGoal] || []}
              isGeneratingSuggestions={isGeneratingSuggestions}
              onGenerateSuggestions={() => generateSuggestions(mediumGoal)}
              onApplySuggestion={(suggestion) => applySuggestion(mediumGoal, suggestion)}
              onUpdateHabit={(index, value) => updateHabit(mediumGoal, index, value)}
              onRemoveHabit={(index) => removeHabit(mediumGoal, index)}
              onAddHabit={() => addHabit(mediumGoal)}
            />
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-center pt-8 pb-12">
        <AppButton
          onClick={handleNext}
          disabled={!isValid}
          variant="primary"
          size="lg"
          className="px-8 py-3"
        >
          🚀 Start Your Journey
        </AppButton>
      </div>
    </div>
  );
};