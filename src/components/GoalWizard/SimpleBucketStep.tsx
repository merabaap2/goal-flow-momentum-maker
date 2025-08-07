import React, { useState } from 'react';
import { AppButton } from '../ui/AppButton';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SimpleBucketStepProps {
  onNext: (bucketItem: string) => void;
}

export const SimpleBucketStep: React.FC<SimpleBucketStepProps> = ({ onNext }) => {
  const [bucketItem, setBucketItem] = useState('');

  const handleNext = () => {
    if (bucketItem.trim()) {
      onNext(bucketItem.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && bucketItem.trim()) {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">🌟</div>
        <h2 className="text-2xl font-bold text-[#374151]">What's Your Dream?</h2>
        <p className="text-gray-600 px-4">
          Let's start with one big dream from your bucket list. What's something you've always wanted to do or achieve?
        </p>
      </div>

      <div className="space-y-4">
        <Textarea
          placeholder="e.g., Travel to Japan, Learn to play guitar, Start my own business..."
          value={bucketItem}
          onChange={(e) => setBucketItem(e.target.value)}
          onKeyPress={handleKeyPress}
          className="min-h-[100px] resize-none border-2 rounded-xl focus:border-[#2BD192] transition-all duration-200"
          autoFocus
        />
        
        <div className="text-center">
          <AppButton
            onClick={handleNext}
            disabled={!bucketItem.trim()}
            size="lg"
            className="w-full"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Let's Make It Happen!
            <ArrowRight className="ml-2 h-5 w-5" />
          </AppButton>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
        <p className="text-xs text-blue-800">
          💡 Don't worry, you can add more dreams later in the app!
        </p>
      </div>
    </div>
  );
};