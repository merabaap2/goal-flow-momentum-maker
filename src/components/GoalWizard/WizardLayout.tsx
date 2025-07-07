
import React from 'react';
import { AppButton } from '../ui/AppButton';
import { ArrowLeft } from 'lucide-react';

interface WizardLayoutProps {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  children: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({
  step,
  totalSteps,
  title,
  description,
  children,
  onBack,
  showBack = true
}) => {
  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-[#F4F6F8] via-white to-[#F4F6F8] overflow-hidden">
      {/* Header with step counter */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md flex-shrink-0">
        {showBack && onBack ? (
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
        ) : (
          <div className="w-9" />
        )}
        
        <span className="text-sm font-medium text-gray-500">
          {step} / {totalSteps}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center space-x-2 px-4 py-3 flex-shrink-0">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i + 1 <= step
                ? 'bg-gradient-to-r from-[#2BD192] to-[#05C2FF]'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Main content area */}
      <div className="flex-1 px-4 py-2 overflow-y-auto">
        {/* Title section */}
        <div className="text-center mb-4 flex-shrink-0">
          <h1 className="text-xl font-bold text-[#374151] mb-2">{title}</h1>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>

        {/* Content */}
        <div className="pb-4">
          {children}
        </div>
      </div>
    </div>
  );
};
