
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderPulseProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

export const LoaderPulse: React.FC<LoaderPulseProps> = ({
  message = "Syncing your goals...",
  showProgress = true,
  progress = 0
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Pulsing Logo */}
      <div className="relative">
        <div className="w-24 h-24 bg-gradient-to-br from-[#2BD192] to-[#05C2FF] rounded-3xl flex items-center justify-center animate-pulse shadow-2xl">
          <span className="text-white text-3xl font-bold">R</span>
        </div>
        <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-[#2BD192] to-[#05C2FF] rounded-3xl animate-ping opacity-20"></div>
      </div>

      {/* Spinning Loader */}
      <div className="flex items-center space-x-3">
        <Loader2 className="h-6 w-6 animate-spin text-[#2BD192]" />
        <span className="text-[#374151] font-medium">{message}</span>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="w-64 h-2 bg-[#F4F6F8] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#2BD192] to-[#05C2FF] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
