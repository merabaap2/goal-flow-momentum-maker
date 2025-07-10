import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { WizardLayout } from './WizardLayout';
import { SimpleBucketStep } from './SimpleBucketStep';
import { SimpleMediumStep } from './SimpleMediumStep';
import { SimpleShortStep } from './SimpleShortStep';
import { SimpleDailyStep } from './SimpleDailyStep';
import { CompletionStep } from './CompletionStep';
import { Dream, Enabler, ShortGoal, DailyHabit } from '../../types';

interface SimpleWizardData {
  bucketItem: string;
  mediumGoals: string[];
  shortGoals: string[];
  dailyHabits: string[];
}

export const SimpleGoalWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<SimpleWizardData>({
    bucketItem: '',
    mediumGoals: [],
    shortGoals: [],
    dailyHabits: [],
  });
  
  const { addDream, setIsFirstLaunch } = useApp();
  const navigate = useNavigate();
  const totalSteps = 5;

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
    // Create the dream structure for the app
    const enablers: Enabler[] = [];
    
    // Create one enabler from the medium goals
    if (wizardData.mediumGoals.length > 0) {
      const shortGoals: ShortGoal[] = wizardData.shortGoals.map((goal, idx) => ({
        id: `short-${idx}`,
        detail: goal,
        done: false,
      }));

      const dailyHabits: DailyHabit[] = wizardData.dailyHabits.map((habit, idx) => ({
        id: `daily-${idx}`,
        detail: habit,
        streak: 0,
        history: [],
      }));

      // Use the first medium goal as the main enabler name
      enablers.push({
        id: 'enabler-0',
        name: wizardData.mediumGoals[0],
        shortGoals,
        dailyHabits,
      });
    }

    const dream: Dream = {
      id: 'dream-0',
      text: wizardData.bucketItem,
      enablers,
    };

    addDream(dream);
    setIsFirstLaunch(false);
    navigate('/home?tab=dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SimpleBucketStep
            onNext={(bucketItem) => {
              setWizardData(prev => ({ ...prev, bucketItem }));
              nextStep();
            }}
          />
        );
      case 2:
        return (
          <SimpleMediumStep
            bucketItem={wizardData.bucketItem}
            onNext={(mediumGoals) => {
              setWizardData(prev => ({ ...prev, mediumGoals }));
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <SimpleShortStep
            bucketItem={wizardData.bucketItem}
            mediumGoals={wizardData.mediumGoals}
            onNext={(shortGoals) => {
              setWizardData(prev => ({ ...prev, shortGoals }));
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <SimpleDailyStep
            bucketItem={wizardData.bucketItem}
            onNext={(dailyHabits) => {
              setWizardData(prev => ({ ...prev, dailyHabits }));
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <CompletionStep
            data={{
              bucketList: [wizardData.bucketItem],
              timeline: 10,
              mediumTermGoals: { [wizardData.bucketItem]: wizardData.mediumGoals },
              shortTermGoals: wizardData.mediumGoals.reduce((acc, goal) => {
                acc[goal] = wizardData.shortGoals;
                return acc;
              }, {} as { [key: string]: string[] }),
              dailyHabits: wizardData.mediumGoals.reduce((acc, goal) => {
                acc[goal] = wizardData.dailyHabits;
                return acc;
              }, {} as { [key: string]: string[] }),
            }}
            onComplete={completeWizard}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  };

  const stepTitles = [
    "🌟 Your Dream",
    "🎯 Medium-Term Goals", 
    "📋 Short-Term Actions",
    "🔄 Daily Habits",
    "🎉 Complete Setup"
  ];

  const stepDescriptions = [
    "Let's start with one dream from your bucket list",
    "What goals will help you achieve this dream?",
    "What actions can you take in the coming weeks?",
    "What daily habits will keep you on track?",
    "Review and finalize your goal roadmap"
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
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 z-50 max-w-[360px] mx-auto">
        <div className="px-4 py-2 text-center">
          <p className="text-xs text-gray-500">Goal Setup in Progress...</p>
        </div>
      </div>
    </div>
  );
};