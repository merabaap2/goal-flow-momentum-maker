import React, { useState } from 'react';
import { AppButton } from '../ui/AppButton';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WizardData } from './GoalWizard';

interface TimelineStepProps {
  data: WizardData;
  onNext: (timeline: number) => void;
  onBack: () => void;
}

const timelineOptions = [
  { years: 5, label: "5 Years", description: "Quick transformation", icon: "⚡" },
  { years: 10, label: "10 Years", description: "Balanced approach", icon: "🎯" },
  { years: 15, label: "15 Years", description: "Steady progress", icon: "🌱" },
  { years: 20, label: "20 Years", description: "Lifetime journey", icon: "🌳" }
];

export const TimelineStep: React.FC<TimelineStepProps> = ({ data, onNext, onBack }) => {
  const [selectedTimeline, setSelectedTimeline] = useState<number>(data.timeline || 10);
  const [customTimeline, setCustomTimeline] = useState<string>('');
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [isCustomSelected, setIsCustomSelected] = useState(false);

  const handlePresetSelect = (years: number) => {
    setSelectedTimeline(years);
    setIsCustomSelected(false);
    // Automatically proceed with preset selection
    onNext(years);
  };

  const handleCustomConfirm = () => {
    const timeline = parseInt(customTimeline);
    if (timeline && timeline > 0) {
      setSelectedTimeline(timeline);
      setIsCustomSelected(true);
      setShowCustomDialog(false);
      onNext(timeline);
    }
  };

  const openCustomDialog = () => {
    setShowCustomDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="text-6xl mb-4">⏰</div>
        <h2 className="text-2xl font-bold text-[#374151]">How much time do you want to give yourself?</h2>
        <p className="text-gray-600 leading-relaxed">
          Consider your current life stage, commitments, and the scope of your dreams. 
          Remember, this is your journey - there's no rush! 🌟
        </p>
      </div>

      {/* First row: 5 and 10 years */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {timelineOptions.slice(0, 2).map((option) => (
          <Card 
            key={option.years}
            className="cursor-pointer transition-all duration-200 hover:shadow-lg border-2 h-28 border-gray-200 hover:border-[#2BD192]"
            onClick={() => handlePresetSelect(option.years)}
          >
            <CardContent className="p-3 text-center h-full flex flex-col justify-center">
              <div className="text-xl mb-1">{option.icon}</div>
              <h3 className="font-bold text-sm text-[#374151] mb-1">{option.label}</h3>
              <p className="text-gray-600 text-xs leading-tight">{option.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Second row: 15 and 20 years */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {timelineOptions.slice(2, 4).map((option) => (
          <Card 
            key={option.years}
            className="cursor-pointer transition-all duration-200 hover:shadow-lg border-2 h-28 border-gray-200 hover:border-[#2BD192]"
            onClick={() => handlePresetSelect(option.years)}
          >
            <CardContent className="p-3 text-center h-full flex flex-col justify-center">
              <div className="text-xl mb-1">{option.icon}</div>
              <h3 className="font-bold text-sm text-[#374151] mb-1">{option.label}</h3>
              <p className="text-gray-600 text-xs leading-tight">{option.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom timeline button spanning full width */}
      <Card 
        className="cursor-pointer transition-all duration-200 border-2 h-24 border-gray-200 hover:border-[#2BD192]"
        onClick={openCustomDialog}
      >
        <CardContent className="p-3 h-full flex flex-col justify-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Target className="h-4 w-4 text-[#2BD192]" />
            <h3 className="font-bold text-sm text-[#374151]">Custom Timeline</h3>
          </div>
          <p className="text-gray-600 text-xs text-center">Set your own timeframe</p>
        </CardContent>
      </Card>

      {/* Custom Timeline Dialog */}
      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent className="sm:max-w-md bg-white z-50">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold text-[#374151]">
              Custom Timeline
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-4">
                How many years do you want to give yourself?
              </p>
              <div className="flex items-center justify-center space-x-3">
                <input
                  type="number"
                  placeholder="Enter years"
                  value={customTimeline}
                  onChange={(e) => setCustomTimeline(e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:border-[#2BD192] focus:outline-none text-center"
                  min="1"
                  max="50"
                  autoFocus
                />
                <span className="text-gray-600 font-medium">years</span>
              </div>
            </div>
            <div className="flex justify-center space-x-3 pt-2">
              <AppButton 
                variant="outline" 
                onClick={() => setShowCustomDialog(false)}
                size="sm"
              >
                Cancel
              </AppButton>
              <AppButton
                onClick={handleCustomConfirm}
                disabled={!customTimeline || parseInt(customTimeline) <= 0}
                size="sm"
              >
                OK
              </AppButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {data.bucketList.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">🎯 Your dreams recap:</p>
              <ul className="space-y-1">
                {data.bucketList.slice(0, 3).map((dream, index) => (
                  <li key={index} className="truncate">• {dream}</li>
                ))}
                {data.bucketList.length > 3 && (
                  <li className="text-blue-600 font-medium">... and {data.bucketList.length - 3} more</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center pt-4">
        <AppButton variant="outline" onClick={onBack}>
          ← Back
        </AppButton>
      </div>
    </div>
  );
};