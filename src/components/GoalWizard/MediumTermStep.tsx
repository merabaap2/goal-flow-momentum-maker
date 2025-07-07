import React, { useState, useEffect } from 'react';
import { AppButton } from '../ui/AppButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Lightbulb, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WizardData } from './GoalWizard';

interface MediumTermStepProps {
  data: WizardData;
  onNext: (mediumTermGoals: { [key: string]: string[] }) => void;
  onBack: () => void;
}

export const MediumTermStep: React.FC<MediumTermStepProps> = ({ data, onNext, onBack }) => {
  const [mediumTermGoals, setMediumTermGoals] = useState<{ [key: string]: string[] }>(
    data.mediumTermGoals || {}
  );
  const [suggestions, setSuggestions] = useState<{ [key: string]: string[] }>({});
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  useEffect(() => {
    // Initialize goals for each bucket list item
    const initialGoals: { [key: string]: string[] } = {};
    data.bucketList.forEach(bucketItem => {
      if (!mediumTermGoals[bucketItem]) {
        initialGoals[bucketItem] = [''];
      }
    });
    if (Object.keys(initialGoals).length > 0) {
      setMediumTermGoals(prev => ({ ...prev, ...initialGoals }));
    }
  }, [data.bucketList]);

  const addGoal = (bucketItem: string) => {
    setMediumTermGoals(prev => ({
      ...prev,
      [bucketItem]: [...(prev[bucketItem] || []), '']
    }));
  };

  const removeGoal = (bucketItem: string, index: number) => {
    setMediumTermGoals(prev => ({
      ...prev,
      [bucketItem]: prev[bucketItem].filter((_, i) => i !== index)
    }));
  };

  const updateGoal = (bucketItem: string, index: number, value: string) => {
    setMediumTermGoals(prev => ({
      ...prev,
      [bucketItem]: prev[bucketItem].map((goal, i) => i === index ? value : goal)
    }));
  };

  const generateSuggestions = async (bucketItem: string) => {
    setIsGeneratingSuggestions(true);
    try {
      // This would use Gemini API to generate suggestions
      const mockSuggestions = getSampleSuggestions(bucketItem);
      setSuggestions(prev => ({
        ...prev,
        [bucketItem]: mockSuggestions
      }));
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const getSampleSuggestions = (bucketItem: string): string[] => {
    const lowerCase = bucketItem.toLowerCase();
    
    if (lowerCase.includes('travel') || lowerCase.includes('visit')) {
      return [
        'Save money for travel budget',
        'Research destinations and create itineraries', 
        'Learn languages of destination countries',
        'Build up vacation time at work',
        'Get necessary travel documents/visas'
      ];
    } else if (lowerCase.includes('business') || lowerCase.includes('entrepreneur')) {
      return [
        'Develop business skills and knowledge',
        'Build professional network',
        'Save capital for investment',
        'Research market opportunities',
        'Create a business plan'
      ];
    } else if (lowerCase.includes('fit') || lowerCase.includes('health')) {
      return [
        'Establish consistent exercise routine',
        'Improve nutrition and diet',
        'Set progressive fitness milestones',
        'Find accountability partner or trainer',
        'Learn about health and wellness'
      ];
    } else {
      return [
        'Break down into smaller milestones',
        'Develop necessary skills',
        'Build supporting habits',
        'Create accountability system',
        'Allocate time and resources'
      ];
    }
  };

  const applySuggestion = (bucketItem: string, suggestion: string) => {
    const currentGoals = mediumTermGoals[bucketItem] || [];
    const emptyIndex = currentGoals.findIndex(goal => goal.trim() === '');
    
    if (emptyIndex !== -1) {
      updateGoal(bucketItem, emptyIndex, suggestion);
    } else {
      setMediumTermGoals(prev => ({
        ...prev,
        [bucketItem]: [...currentGoals, suggestion]
      }));
    }
  };

  const isValid = data.bucketList.every(bucketItem => {
    const goals = mediumTermGoals[bucketItem] || [];
    return goals.some(goal => goal.trim().length > 0);
  });

  const handleNext = () => {
    // Clean up empty goals
    const cleanedGoals: { [key: string]: string[] } = {};
    Object.keys(mediumTermGoals).forEach(bucketItem => {
      cleanedGoals[bucketItem] = mediumTermGoals[bucketItem].filter(goal => goal.trim().length > 0);
    });
    onNext(cleanedGoals);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-2xl font-bold text-[#374151]">What medium-term goals will help you achieve your dreams?</h2>
        <p className="text-gray-600 leading-relaxed">
          For each of your bucket list items, let's identify the key medium-term goals that will move you closer to your dreams over the next {data.timeline} years.
        </p>
      </div>

      <div className="space-y-6">
        {data.bucketList.map((bucketItem, bucketIndex) => (
          <Card key={bucketIndex} className="border-2 border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-[#374151] mb-2">
                    🌟 {bucketItem}
                  </CardTitle>
                </div>
                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => generateSuggestions(bucketItem)}
                  disabled={isGeneratingSuggestions}
                  className="shrink-0"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {isGeneratingSuggestions ? 'Generating...' : 'Get Ideas'}
                </AppButton>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {suggestions[bucketItem] && suggestions[bucketItem].length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800 text-sm">AI Suggestions:</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {suggestions[bucketItem].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => applySuggestion(bucketItem, suggestion)}
                        className="text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm"
                      >
                        • {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {(mediumTermGoals[bucketItem] || []).map((goal, goalIndex) => (
                  <div key={goalIndex} className="relative group">
                    <Textarea
                      placeholder={`Medium-term goal ${goalIndex + 1} for "${bucketItem}"...`}
                      value={goal}
                      onChange={(e) => updateGoal(bucketItem, goalIndex, e.target.value)}
                      className={cn(
                        "min-h-[80px] resize-none border-2 rounded-lg focus:border-[#2BD192] transition-all duration-200",
                        goal.trim() && "border-[#2BD192] bg-green-50/50"
                      )}
                    />
                    {(mediumTermGoals[bucketItem] || []).length > 1 && (
                      <button
                        onClick={() => removeGoal(bucketItem, goalIndex)}
                        className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => addGoal(bucketItem)}
                className="w-full p-4 border-2 border-dashed border-[#2BD192] rounded-lg text-[#2BD192] hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add another medium-term goal</span>
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