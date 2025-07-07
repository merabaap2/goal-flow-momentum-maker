
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
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Animated Dots */}
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-gradient-to-r from-[#2BD192] to-[#05C2FF] rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-gradient-to-r from-[#2BD192] to-[#05C2FF] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-gradient-to-r from-[#2BD192] to-[#05C2FF] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>

      {/* Spinning Loader with Enhanced Animation */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Loader2 className="h-8 w-8 animate-spin text-[#2BD192]" />
          <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-[#2BD192] opacity-20"></div>
        </div>
        <span className="text-[#374151] font-medium text-lg">{message}</span>
      </div>

      {/* Enhanced Progress Bar with Glow Effect */}
      {showProgress && (
        <div className="w-80 h-3 bg-[#F4F6F8] rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-[#2BD192] to-[#05C2FF] rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Floating Particles Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="w-1 h-1 bg-[#2BD192] rounded-full absolute animate-ping opacity-40" style={{ top: '20%', left: '10%', animationDelay: '0s' }}></div>
        <div className="w-1 h-1 bg-[#05C2FF] rounded-full absolute animate-ping opacity-40" style={{ top: '60%', right: '15%', animationDelay: '1s' }}></div>
        <div className="w-1 h-1 bg-[#2BD192] rounded-full absolute animate-ping opacity-40" style={{ bottom: '30%', left: '20%', animationDelay: '2s' }}></div>
        <div className="w-1 h-1 bg-[#05C2FF] rounded-full absolute animate-ping opacity-40" style={{ top: '40%', right: '25%', animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
};
