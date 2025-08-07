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
    <div className="min-h-screen bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white -m-6">
      {/* Header */}
      <div className="pt-16 pb-8 text-center">
        <div className="inline-block">
          <h1 className="text-xl font-medium mb-2">Your Bucket List</h1>
          <div className="w-full h-0.5 bg-white"></div>
        </div>
        <p className="text-white/80 mt-4 px-4">
          Let's start with one dream from your bucket list
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 space-y-6">
        {/* Star Icon */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-full mb-6">
            <div className="text-3xl">⭐</div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-light text-center mb-8">What's Your Dream?</h2>
        
        <p className="text-white/80 text-center px-4 mb-8">
          Let's start with one big dream from your bucket list. What's something you've always wanted to do or achieve?
        </p>

        {/* Dream Input */}
        <div className="bg-black/20 rounded-2xl p-1 mb-6">
          <Textarea
            placeholder="e.g., Travel to Japan, Learn to play guitar, Start my own business..."
            value={bucketItem}
            onChange={(e) => setBucketItem(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[120px] bg-black/40 border-none text-white placeholder:text-gray-300 resize-none rounded-xl focus:ring-0 focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
        </div>
        
        {/* Submit Button */}
        <div className="pt-4">
          <AppButton
            onClick={handleNext}
            disabled={!bucketItem.trim()}
            className="w-full bg-gradient-to-r from-[#2BD192] to-[#05C2FF] hover:from-[#25B885] hover:to-[#0494CC] text-white rounded-2xl py-4 text-lg font-medium shadow-lg"
            size="lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Let's Make It Happen!
            <ArrowRight className="ml-2 h-5 w-5" />
          </AppButton>
        </div>

        {/* Info Note */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center mt-6">
          <p className="text-sm text-white/80">
            💡 Don't worry, you can add more dreams later in the app!
          </p>
        </div>
      </div>
    </div>
  );
};