import React, { useState } from 'react';
import { AppButton } from './ui/AppButton';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AddDreamFormProps {
  onSubmit?: (dream: {
    description: string;
    timeline: number;
    pledgeAmount: number;
    currency: 'USDT' | 'RDM';
  }) => void;
}

export const AddDreamForm: React.FC<AddDreamFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [dreamDescription, setDreamDescription] = useState('');
  const [selectedTimeline, setSelectedTimeline] = useState<number>(5);
  const [showCustomTimeline, setShowCustomTimeline] = useState(false);
  const [customTimeline, setCustomTimeline] = useState('');
  const [pledgeAmount, setPledgeAmount] = useState('1500');
  const [currency, setCurrency] = useState<'USDT' | 'RDM'>('RDM');

  const timelineOptions = [5, 10, 15];
  const balance = 1200;
  const minUSD = 1;

  const handleTimelineSelect = (years: number) => {
    setSelectedTimeline(years);
    setShowCustomTimeline(false);
  };

  const handleCustomTimelineToggle = () => {
    setShowCustomTimeline(!showCustomTimeline);
  };

  const handleSubmit = () => {
    if (dreamDescription.trim() && pledgeAmount) {
      const finalTimeline = showCustomTimeline ? parseInt(customTimeline) : selectedTimeline;
      onSubmit?.({
        description: dreamDescription.trim(),
        timeline: finalTimeline,
        pledgeAmount: parseInt(pledgeAmount),
        currency
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white">
      {/* Header */}
      <div className="pt-16 pb-8 text-center">
        <div className="inline-block">
          <h1 className="text-xl font-medium mb-2">Bucket List</h1>
          <div className="w-full h-0.5 bg-white"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 space-y-6">
        {/* Title */}
        <h2 className="text-3xl font-light text-center mb-8">Add Your Dream</h2>

        {/* Dream Description */}
        <div className="bg-black/20 rounded-2xl p-1">
          <Textarea
            placeholder="Trip to Las Vegas"
            value={dreamDescription}
            onChange={(e) => setDreamDescription(e.target.value)}
            className="min-h-[120px] bg-black/40 border-none text-white placeholder:text-gray-300 resize-none rounded-xl focus:ring-0 focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Timeline Section */}
        <div className="bg-black/20 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-medium">Timeline</h3>
          
          {/* Timeline Options */}
          <div className="flex gap-3">
            {timelineOptions.map((years) => (
              <button
                key={years}
                onClick={() => handleTimelineSelect(years)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  selectedTimeline === years && !showCustomTimeline
                    ? 'bg-[#4F46E5] text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                {years} Years
              </button>
            ))}
          </div>

          {/* Custom Timeline Button */}
          <button
            onClick={handleCustomTimelineToggle}
            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-left transition-all ${
              showCustomTimeline
                ? 'bg-[#4F46E5] text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            <span>Enter Custom Timeline</span>
            <Calendar className="h-5 w-5" />
          </button>

          {/* Custom Timeline Input */}
          {showCustomTimeline && (
            <Input
              type="number"
              placeholder="Enter years"
              value={customTimeline}
              onChange={(e) => setCustomTimeline(e.target.value)}
              className="bg-black/40 border-gray-600 text-white placeholder:text-gray-400"
            />
          )}
        </div>

        {/* Pledge RDM Section */}
        <div className="bg-black/20 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Pledge RDM</h3>
            <span className="text-sm text-gray-300">Balance: {balance} RDM</span>
          </div>
          
          <div className="text-sm text-gray-300 mb-4">Today's Rate</div>
          
          {/* Currency Selection */}
          <div className="flex gap-4">
            {/* USDT Section */}
            <div className="flex-1">
              <div className="text-sm mb-2">USDT</div>
              <div className="bg-gray-600 rounded-2xl px-4 py-3 text-center text-gray-300">
                Min {minUSD} USD
              </div>
            </div>
            
            {/* RDM Section */}
            <div className="flex-1">
              <div className="text-sm mb-2">RDM</div>
              <Input
                type="number"
                value={pledgeAmount}
                onChange={(e) => setPledgeAmount(e.target.value)}
                className="bg-gray-600 border-none text-white text-center rounded-2xl py-3"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 pb-8">
          <AppButton
            onClick={handleSubmit}
            disabled={!dreamDescription.trim() || !pledgeAmount}
            className="w-full bg-white text-[#4F46E5] hover:bg-gray-100 rounded-2xl py-4 text-lg font-medium"
            size="lg"
          >
            Enter
          </AppButton>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm">
        <div className="flex justify-around py-3">
          <button 
            onClick={() => navigate('/')}
            className="flex flex-col items-center space-y-1 p-2"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xs text-gray-300">Home</span>
          </button>
          
          <button className="flex flex-col items-center space-y-1 p-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xs text-blue-400">Bucket List</span>
          </button>
          
          <button className="flex flex-col items-center space-y-1 p-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xs text-gray-300">Goals</span>
          </button>
          
          <button className="flex flex-col items-center space-y-1 p-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <span className="text-xs text-gray-300">Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};