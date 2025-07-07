import React, { useState, useEffect } from 'react';
import { AppButton } from '../ui/AppButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Lightbulb, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WizardData } from './GoalWizard';
import { generateGeminiSuggestions } from '../../lib/gemini';

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
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

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
      const prompt = `For the life goal/dream: "${bucketItem}", what are the most important medium-term goals someone should focus on to achieve this dream? Consider practical steps like skill development, resource building, networking, planning, etc.`;
      
      const aiSuggestions = await generateGeminiSuggestions(prompt, `User's dream: ${bucketItem}`);
      
      if (aiSuggestions.length > 0) {
        setSuggestions(prev => ({
          ...prev,
          [bucketItem]: aiSuggestions
        }));
      } else {
        // Fallback to sample suggestions if AI fails
        const fallbackSuggestions = getSampleSuggestions(bucketItem);
        setSuggestions(prev => ({
          ...prev,
          [bucketItem]: fallbackSuggestions
        }));
      }
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      const fallbackSuggestions = getSampleSuggestions(bucketItem);
      setSuggestions(prev => ({
        ...prev,
        [bucketItem]: fallbackSuggestions
      }));
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
    <div className="space-y-4 pb-4">
      <div className="text-center space-y-3">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-2xl font-bold text-[#374151]">What goals will help you achieve your dreams?</h2>
        <p className="text-gray-600 leading-relaxed px-2">
          Break down each dream into {data.timeline}-year action steps 🚀
        </p>
      </div>

      <div className="space-y-4">
        {data.bucketList.map((bucketItem, bucketIndex) => (
          <Card key={bucketIndex} className="border-2 border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle 
                    className={cn(
                      "text-base text-[#374151] mb-1 cursor-pointer hover:text-[#2BD192] transition-colors pr-2",
                      !expandedItems[bucketItem] && 'line-clamp-1'
                    )}
                    onClick={() => {
                      setExpandedItems(prev => ({
                        ...prev,
                        [bucketItem]: !prev[bucketItem]
                      }));
                    }}
                    title="Click to expand/collapse"
                  >
                    🌟 {bucketItem}
                  </CardTitle>
                  <button
                    onClick={() => setExpandedItems(prev => ({
                      ...prev,
                      [bucketItem]: !prev[bucketItem]
                    }))}
                    className="text-xs text-gray-500 hover:text-[#2BD192] transition-colors"
                  >
                    {expandedItems[bucketItem] ? "Show less" : "Show more..."}
                  </button>
                </div>
                <div className="flex-shrink-0">
                  <AppButton
                    variant="outline"
                    size="sm"
                    onClick={() => generateSuggestions(bucketItem)}
                    disabled={isGeneratingSuggestions}
                    className="text-xs px-3 py-1 h-8"
                  >
                    <Lightbulb className="h-3 w-3 text-yellow-500" />
                  </AppButton>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {suggestions[bucketItem] && suggestions[bucketItem].length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-3 w-3 text-blue-600" />
                    <span className="font-medium text-blue-800 text-xs">Quick Ideas:</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {suggestions[bucketItem].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => applySuggestion(bucketItem, suggestion)}
                        className="text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-xs leading-relaxed"
                      >
                        <div>• {suggestion}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {(mediumTermGoals[bucketItem] || []).map((goal, goalIndex) => (
                  <div key={goalIndex} className="relative group">
                    <Textarea
                      placeholder={`Goal ${goalIndex + 1} for ${bucketItem}...`}
                      value={goal}
                      onChange={(e) => updateGoal(bucketItem, goalIndex, e.target.value)}
                      className={cn(
                        "min-h-[60px] resize-none border-2 rounded-lg focus:border-[#2BD192] transition-all duration-200 text-sm",
                        goal.trim() && "border-[#2BD192] bg-green-50/50"
                      )}
                    />
                    {(mediumTermGoals[bucketItem] || []).length > 1 && (
                      <button
                        onClick={() => removeGoal(bucketItem, goalIndex)}
                        className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => addGoal(bucketItem)}
                className="w-full p-3 border-2 border-dashed border-[#2BD192] rounded-lg text-[#2BD192] hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
              >
                <Plus className="h-3 w-3" />
                <span>Add goal</span>
              </button>
            </CardContent>
          </Card>
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