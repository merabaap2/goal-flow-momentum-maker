import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { WizardLayout } from './WizardLayout';
import { BucketListStep } from './BucketListStep';
import { TimelineStep } from './TimelineStep';
import { MediumTermStep } from './MediumTermStep';
import { ShortTermStep } from './ShortTermStep';
import { DailyHabitsStep } from './DailyHabitsStep';
import { CompletionStep } from './CompletionStep';
import { Dream, Enabler, ShortGoal, DailyHabit } from '../../types';

export interface WizardData {
  bucketList: string[];
  timeline: number;
  mediumTermGoals: { [key: string]: string[] };
  shortTermGoals: { [key: string]: string[] };
  dailyHabits: { [key: string]: string[] };
}

export const GoalWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    bucketList: [],
    timeline: 10,
    mediumTermGoals: {},
    shortTermGoals: {},
    dailyHabits: {},
  });
  
  const { addDream, setIsFirstLaunch } = useApp();
  const navigate = useNavigate();
  const totalSteps = 6;

  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeWizard = () => {
    // Convert wizard data to app data structure
    wizardData.bucketList.forEach((bucketItem, index) => {
      const enablers: Enabler[] = [];
      
      // Get medium term goals for this bucket item
      const mediumGoals = wizardData.mediumTermGoals[bucketItem] || [];
      
      mediumGoals.forEach((mediumGoal) => {
        const shortGoals: ShortGoal[] = (wizardData.shortTermGoals[mediumGoal] || []).map((goal, idx) => ({
          id: `short-${index}-${idx}`,
          detail: goal,
          done: false,
        }));

        const dailyHabits: DailyHabit[] = (wizardData.dailyHabits[mediumGoal] || []).map((habit, idx) => ({
          id: `daily-${index}-${idx}`,
          detail: habit,
          streak: 0,
          history: [],
        }));

        enablers.push({
          id: `enabler-${index}-${enablers.length}`,
          name: mediumGoal,
          shortGoals,
          dailyHabits,
        });
      });

      const dream: Dream = {
        id: `dream-${index}`,
        text: bucketItem,
        enablers,
      };

      addDream(dream);
    });

    setIsFirstLaunch(false);
    navigate('/home?tab=dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BucketListStep
            data={wizardData}
            onNext={(bucketList) => {
              updateWizardData({ bucketList });
              nextStep();
            }}
          />
        );
      case 2:
        return (
          <TimelineStep
            data={wizardData}
            onNext={(timeline) => {
              updateWizardData({ timeline });
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <MediumTermStep
            data={wizardData}
            onNext={(mediumTermGoals) => {
              updateWizardData({ mediumTermGoals });
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <ShortTermStep
            data={wizardData}
            onNext={(shortTermGoals) => {
              updateWizardData({ shortTermGoals });
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <DailyHabitsStep
            data={wizardData}
            onNext={(dailyHabits) => {
              updateWizardData({ dailyHabits });
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      case 6:
        return (
          <CompletionStep
            data={wizardData}
            onComplete={completeWizard}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  };

  const stepTitles = [
    "📝 Share Your Dreams",
    "⏰ Set Your Timeline", 
    "🎯 Medium-Term Goals",
    "📋 Short-Term Actions",
    "🔄 Daily Habits",
    "🎉 Complete Setup"
  ];

  const stepDescriptions = [
    "Let's start with your biggest aspirations and bucket list dreams",
    "How long do you want to take to achieve these dreams?",
    "What medium-term goals will help you reach your dreams?",
    "What short-term actions will move you forward?",
    "What daily habits will keep you on track?",
    "Review and finalize your personalized goal roadmap"
  ];

  return (
    <div className="relative">
      <WizardLayout
        step={currentStep}
        totalSteps={totalSteps}
        title={stepTitles[currentStep - 1]}
        description={stepDescriptions[currentStep - 1]}
        onBack={currentStep > 1 ? prevStep : undefined}
        showBack={currentStep > 1}
      >
        {renderStep()}
      </WizardLayout>
      
      {/* Bottom Navigation - Hidden during wizard */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 z-50 max-w-[360px] mx-auto">
        <div className="px-4 py-2 text-center">
          <p className="text-xs text-gray-500">Goal Setup in Progress...</p>
        </div>
      </div>
    </div>
  );
};