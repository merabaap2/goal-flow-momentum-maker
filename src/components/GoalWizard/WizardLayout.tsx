
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
    <div className="min-h-screen bg-gradient-to-br from-[#F4F6F8] via-white to-[#F4F6F8] p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-between">
            {showBack && onBack ? (
              <AppButton variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </AppButton>
            ) : (
              <div />
            )}
            <span className="text-sm font-medium text-gray-500">
              {step} / {totalSteps}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-[#374151]">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mb-8">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i + 1 <= step
                  ? 'bg-gradient-to-r from-[#2BD192] to-[#05C2FF] scale-110'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {children}
        </div>
      </div>
    </div>
  );
};
