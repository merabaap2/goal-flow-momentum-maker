import React, { useState } from 'react';
import { AppButton } from '../ui/AppButton';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WizardData } from './GoalWizard';

interface BucketListStepProps {
  data: WizardData;
  onNext: (bucketList: string[]) => void;
}

export const BucketListStep: React.FC<BucketListStepProps> = ({ data, onNext }) => {
  const [bucketList, setBucketList] = useState<string[]>(data.bucketList.length > 0 ? data.bucketList : ['']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addGoal = () => {
    if (bucketList.length < 10) {
      setBucketList([...bucketList, '']);
    }
  };

  const removeGoal = (index: number) => {
    if (bucketList.length > 1) {
      setBucketList(bucketList.filter((_, i) => i !== index));
    }
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...bucketList];
    newGoals[index] = value;
    setBucketList(newGoals);
  };

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    try {
      const validGoals = bucketList.filter(goal => goal.trim().length > 0);
      // AI analysis can be added here using Gemini API
      console.log('Analyzing goals with AI:', validGoals);
      // For now, just proceed
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const validGoals = bucketList.filter(goal => goal.trim().length > 0);
  const canProceed = validGoals.length >= 1;

  const handleNext = async () => {
    if (isAnalyzing) return;
    await analyzeWithAI();
    onNext(validGoals);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="text-6xl mb-4">🌟</div>
        <h2 className="text-2xl font-bold text-[#374151]">What are your biggest dreams?</h2>
        <p className="text-gray-600 leading-relaxed">
          Think about your bucket list - the experiences, achievements, and aspirations that would make your life truly fulfilling. 
          Don't hold back - dream big! ✨
        </p>
      </div>

      <div className="space-y-4">
        {bucketList.map((goal, index) => (
          <div key={index} className="relative group">
            <Textarea
              placeholder={`💭 Dream ${index + 1}: What would make your life amazing?`}
              value={goal}
              onChange={(e) => updateGoal(index, e.target.value)}
              className={cn(
                "min-h-[100px] resize-none border-2 rounded-xl focus:border-[#2BD192] transition-all duration-200 text-base",
                goal.trim() && "border-[#2BD192] bg-green-50/50"
              )}
            />
            {bucketList.length > 1 && (
              <button
                onClick={() => removeGoal(index)}
                className="absolute top-3 right-3 p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {bucketList.length < 10 && (
        <button
          onClick={addGoal}
          className="w-full p-6 border-2 border-dashed border-[#2BD192] rounded-xl text-[#2BD192] hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-3 text-lg"
        >
          <Plus className="h-6 w-6" />
          <span>Add another dream</span>
        </button>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">💡 Pro tip:</p>
            <p>Be specific and personal. Instead of "travel more," try "Experience the Northern Lights in Iceland" or "Learn to cook authentic Italian pasta in Tuscany."</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <AppButton
          onClick={handleNext}
          disabled={!canProceed || isAnalyzing}
          size="lg"
          className="min-w-[120px]"
        >
          {isAnalyzing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing...</span>
            </div>
          ) : (
            "Next Step →"
          )}
        </AppButton>
      </div>
    </div>
  );
};