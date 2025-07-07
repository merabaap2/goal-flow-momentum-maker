
import React, { useState } from 'react';
import { AppButton } from '../ui/AppButton';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step1BucketProps {
  onNext: (dreams: string[]) => void;
}

export const Step1Bucket: React.FC<Step1BucketProps> = ({ onNext }) => {
  const [dreams, setDreams] = useState<string[]>(['']);

  const addDream = () => {
    if (dreams.length < 5) {
      setDreams([...dreams, '']);
    }
  };

  const removeDream = (index: number) => {
    if (dreams.length > 1) {
      setDreams(dreams.filter((_, i) => i !== index));
    }
  };

  const updateDream = (index: number, value: string) => {
    const newDreams = [...dreams];
    newDreams[index] = value;
    setDreams(newDreams);
  };

  const validDreams = dreams.filter(dream => dream.trim().length > 0);
  const canProceed = validDreams.length >= 1;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-[#374151]">📝 Bucket Dreams</h2>
        <p className="text-gray-600">What are your biggest aspirations? List up to 5 dreams.</p>
      </div>

      <div className="space-y-4">
        {dreams.map((dream, index) => (
          <div key={index} className="relative group">
            <Textarea
              placeholder={`Dream ${index + 1}...`}
              value={dream}
              onChange={(e) => updateDream(index, e.target.value)}
              className={cn(
                "min-h-[80px] resize-none border-2 rounded-xl focus:border-[#2BD192] transition-all duration-200",
                dream.trim() && "border-[#2BD192] bg-green-50"
              )}
            />
            {dreams.length > 1 && (
              <button
                onClick={() => removeDream(index)}
                className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {dreams.length < 5 && (
        <button
          onClick={addDream}
          className="w-full p-4 border-2 border-dashed border-[#2BD192] rounded-xl text-[#2BD192] hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add another dream</span>
        </button>
      )}

      <div className="flex justify-end pt-4">
        <AppButton
          onClick={() => onNext(validDreams)}
          disabled={!canProceed}
          size="lg"
        >
          Next Step
        </AppButton>
      </div>
    </div>
  );
};
