import React, { useState } from 'react';
import { AppButton } from '../ui/AppButton';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WizardData } from './GoalWizard';
import { analyzeGoalsWithGemini } from '../../lib/gemini';

interface BucketListStepProps {
  data: WizardData;
  onNext: (bucketList: string[]) => void;
}

export const BucketListStep: React.FC<BucketListStepProps> = ({ data, onNext }) => {
  const [bucketList, setBucketList] = useState<string[]>(data.bucketList.length > 0 ? data.bucketList : ['']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');

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
      if (validGoals.length > 0) {
        const aiAnalysis = await analyzeGoalsWithGemini(validGoals, 10);
        setAnalysis(aiAnalysis);
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      setAnalysis('Your goals show great ambition! Focus on breaking them down into smaller, actionable steps.');
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
    <div className="h-full flex flex-col">
      {/* Main content */}
      <div className="flex-1 space-y-4">
        {/* Big emoji and question */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="text-lg font-bold text-[#374151] mb-3">What are your biggest bucket list items?</h2>
          <p className="text-sm text-gray-600 leading-relaxed px-2">
            Think about your bucket list - the experiences, achievements, and aspirations that would make your life truly fulfilling. Don't hold back - think big! ✨
          </p>
        </div>

        {/* Dream inputs */}
        <div className="space-y-3 max-h-[200px] overflow-y-auto">
          {bucketList.map((dream, index) => (
            <div key={index} className="relative group">
              <Textarea
                placeholder={`💭 Bucket List Item ${index + 1}: What would make your life amazing?`}
                value={dream}
                onChange={(e) => updateGoal(index, e.target.value)}
                className={cn(
                  "min-h-[60px] resize-none border-2 rounded-xl focus:border-[#2BD192] transition-all duration-200 text-sm",
                  dream.trim() && "border-[#2BD192] bg-green-50/50"
                )}
              />
              {bucketList.length > 1 && (
                <button
                  onClick={() => removeGoal(index)}
                  className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add button */}
        {bucketList.length < 10 && (
          <button
            onClick={addGoal}
            className="w-full p-4 border-2 border-dashed border-[#2BD192] rounded-xl text-[#2BD192] hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add another bucket list item</span>
          </button>
        )}

        {/* AI Analysis */}
        {analysis && (
          <div className="bg-gradient-to-r from-[#2BD192]/10 to-[#05C2FF]/10 border border-[#2BD192]/30 rounded-xl p-4">
            <div className="flex items-start space-x-2">
              <Sparkles className="h-4 w-4 text-[#2BD192] mt-0.5" />
              <div>
                <h3 className="font-bold text-[#374151] text-sm mb-1">🤖 AI Analysis</h3>
                <p className="text-[#374151] text-xs leading-relaxed">{analysis}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pro tip */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <div className="flex items-start space-x-2">
            <div className="text-lg">💡</div>
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-1">Pro tip:</p>
              <p>Be specific and personal. Instead of "travel more," try "Experience the Northern Lights in Iceland" or "Learn to cook authentic Italian pasta in Tuscany."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom button */}
      <div className="pt-4 pb-2">
        <AppButton
          onClick={handleNext}
          disabled={!canProceed || isAnalyzing}
          className="w-full h-11 text-base font-semibold"
        >
          {isAnalyzing ? (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
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