import React, { useState, useEffect } from 'react';
import { AppButton } from '../ui/AppButton';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WizardData } from './GoalWizard';
import { analyzeGoalsWithGemini } from '../../lib/gemini';

interface BucketListStepProps {
  data: WizardData;
  onNext: (bucketList: string[]) => void;
}

type ConversationState = 'intro' | 'asking' | 'asking-more' | 'review' | 'analyzing';

const motivationalQuotes = [
  "Life is short, but you can live it fully! ✨",
  "Your dreams are waiting for you to chase them! 🌟",
  "Every expert was once a beginner. What's calling to you? 💫",
  "The best time to plant a tree was 20 years ago. The second best time is now! 🌱",
  "You have more time than you think - make it count! ⏰",
  "Adventure is out there waiting for you! 🗺️"
];

const encouragingMessages = [
  "Amazing choice! That sounds incredible! 🔥",
  "Wow, I love this one! You're thinking big! 💫",
  "This is going to be epic! 🚀",
  "Yes! This is exactly the kind of thinking we need! ⭐",
  "Beautiful! This will create amazing memories! 🌟",
  "Perfect! You're building an incredible life plan! 💎"
];

export const BucketListStep: React.FC<BucketListStepProps> = ({ data, onNext }) => {
  const [bucketList, setBucketList] = useState<string[]>(data.bucketList.length > 0 ? data.bucketList : []);
  const [currentInput, setCurrentInput] = useState('');
  const [conversationState, setConversationState] = useState<ConversationState>('intro');
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');

  useEffect(() => {
    // Rotate quotes every few seconds to keep it fresh
    const interval = setInterval(() => {
      setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const addBucketItem = () => {
    if (currentInput.trim()) {
      setBucketList([...bucketList, currentInput.trim()]);
      setCurrentInput('');
      setShowEncouragement(true);
      setTimeout(() => setShowEncouragement(false), 2000);
      setConversationState('asking-more');
    }
  };

  const startOver = () => {
    setConversationState('asking');
    setCurrentInput('');
  };

  const addMore = () => {
    setConversationState('asking');
    setCurrentInput('');
  };

  const finishList = () => {
    setConversationState('review');
  };

  const removeBucketItem = (index: number) => {
    setBucketList(bucketList.filter((_, i) => i !== index));
    if (bucketList.length === 1) {
      setConversationState('asking');
    }
  };

  const analyzeWithAI = async () => {
    setConversationState('analyzing');
    setIsAnalyzing(true);
    try {
      if (bucketList.length > 0) {
        const aiAnalysis = await analyzeGoalsWithGemini(bucketList, 10);
        setAnalysis(aiAnalysis);
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      setAnalysis('Your goals show great ambition! Focus on breaking them down into smaller, actionable steps.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = async () => {
    if (isAnalyzing) return;
    await analyzeWithAI();
    onNext(bucketList);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && currentInput.trim()) {
      e.preventDefault();
      addBucketItem();
    }
  };

  const renderIntroState = () => (
    <div className="text-center space-y-6 animate-fade-in">
      <div className="text-6xl mb-4">🌟</div>
      <div>
        <h2 className="text-xl font-bold text-[#374151] mb-3">Let's Dream Big Together!</h2>
        <p className="text-sm text-gray-600 leading-relaxed px-2 mb-4">
          {currentQuote}
        </p>
        <p className="text-xs text-gray-500">
          I'm here to help you create an amazing bucket list that will inspire your journey ahead.
        </p>
      </div>
      
      <div className="mt-8">
        <AppButton
          onClick={() => setConversationState('asking')}
          className="w-full h-12 text-base font-semibold"
        >
          Let's Start! 🚀
        </AppButton>
      </div>
    </div>
  );

  const renderAskingState = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <div className="text-4xl mb-4">✨</div>
        <h2 className="text-lg font-bold text-[#374151] mb-2">
          {bucketList.length === 0 ? "What's your first bucket list dream?" : "What else would make your life incredible?"}
        </h2>
        <p className="text-sm text-gray-600 px-2">
          {currentQuote}
        </p>
      </div>

      <div className="space-y-4">
        <Textarea
          placeholder="Type your bucket list item here... (e.g., 'See the Northern Lights in Iceland')"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="min-h-[80px] resize-none border-2 rounded-xl focus:border-[#2BD192] transition-all duration-200 text-sm"
          autoFocus
        />
        
        <AppButton
          onClick={addBucketItem}
          disabled={!currentInput.trim()}
          className="w-full h-11 text-base font-semibold"
        >
          Add to My List <ArrowRight className="ml-2 h-4 w-4" />
        </AppButton>
      </div>

      {/* Show existing items */}
      {bucketList.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <h3 className="font-bold text-green-800 text-sm mb-2">Your Bucket List So Far:</h3>
          <div className="space-y-2">
            {bucketList.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-white rounded-lg p-2">
                <span className="text-sm text-gray-700">• {item}</span>
                <button
                  onClick={() => removeBucketItem(index)}
                  className="text-red-500 hover:bg-red-50 rounded p-1"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAskingMoreState = () => (
    <div className="space-y-6 animate-fade-in">
      {showEncouragement && (
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl p-4 text-center animate-scale-in">
          <Heart className="mx-auto h-6 w-6 mb-2" />
          <p className="font-semibold">
            {encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]}
          </p>
        </div>
      )}

      <div className="text-center">
        <div className="text-4xl mb-4">🤔</div>
        <h2 className="text-lg font-bold text-[#374151] mb-2">Will this be enough?</h2>
        <p className="text-sm text-gray-600 px-2 mb-4">
          You have {bucketList.length} item{bucketList.length !== 1 ? 's' : ''} on your list. Remember, you can live long enough to experience so much more!
        </p>
        <p className="text-xs text-blue-600 italic">
          "The biggest risk is not taking any risk... In a world that's changing really quickly, the only strategy that is guaranteed to fail is not taking risks." - Mark Zuckerberg
        </p>
      </div>

      <div className="space-y-3">
        <AppButton
          onClick={addMore}
          variant="primary"
          className="w-full h-11 text-base font-semibold"
        >
          Add More Dreams! ✨
        </AppButton>
        <AppButton
          onClick={finishList}
          variant="outline"
          className="w-full h-11 text-base font-semibold"
        >
          I'm Good With These {bucketList.length} 👍
        </AppButton>
      </div>

      {/* Show current list */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
        <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center">
          <Sparkles className="mr-2 h-4 w-4" />
          Your Amazing Bucket List:
        </h3>
        <div className="space-y-2">
          {bucketList.map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
              <span className="text-sm text-gray-700 flex-1">
                <span className="font-medium text-green-600">#{index + 1}</span> {item}
              </span>
              <button
                onClick={() => removeBucketItem(index)}
                className="text-red-500 hover:bg-red-50 rounded p-1 ml-2"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReviewState = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <div className="text-5xl mb-4">🎯</div>
        <h2 className="text-lg font-bold text-[#374151] mb-2">Your Incredible Bucket List!</h2>
        <p className="text-sm text-gray-600 px-2">
          These {bucketList.length} dreams are going to shape an amazing journey ahead. Ready to make them happen?
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
        <div className="space-y-3">
          {bucketList.map((item, index) => (
            <div key={index} className="flex items-center bg-white rounded-lg p-4 shadow-sm">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                {index + 1}
              </div>
              <span className="text-sm text-gray-700 flex-1">{item}</span>
              <button
                onClick={() => removeBucketItem(index)}
                className="text-red-500 hover:bg-red-50 rounded p-1 ml-2"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <AppButton
          onClick={handleNext}
          className="w-full h-12 text-base font-semibold"
        >
          Let's Make Them Happen! 🚀
        </AppButton>
        <AppButton
          onClick={addMore}
          variant="ghost"
          className="w-full h-10 text-sm"
        >
          Actually, let me add one more...
        </AppButton>
      </div>
    </div>
  );

  const renderAnalyzingState = () => (
    <div className="space-y-6 animate-fade-in text-center">
      <div className="text-5xl mb-4">🤖</div>
      <div>
        <h2 className="text-lg font-bold text-[#374151] mb-2">Analyzing Your Dreams...</h2>
        <p className="text-sm text-gray-600 px-2 mb-4">
          I'm creating a personalized roadmap to help you achieve these incredible goals!
        </p>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-[#2BD192] rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-[#05C2FF] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      {analysis && (
        <div className="bg-gradient-to-r from-[#2BD192]/10 to-[#05C2FF]/10 border border-[#2BD192]/30 rounded-xl p-4 animate-scale-in">
          <div className="flex items-start space-x-2">
            <Sparkles className="h-4 w-4 text-[#2BD192] mt-0.5" />
            <div className="text-left">
              <h3 className="font-bold text-[#374151] text-sm mb-1">🤖 AI Insights</h3>
              <p className="text-[#374151] text-xs leading-relaxed">{analysis}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto">
        {conversationState === 'intro' && renderIntroState()}
        {conversationState === 'asking' && renderAskingState()}
        {conversationState === 'asking-more' && renderAskingMoreState()}
        {conversationState === 'review' && renderReviewState()}
        {conversationState === 'analyzing' && renderAnalyzingState()}
      </div>
    </div>
  );
};