import React from 'react';
import { AppButton } from '../ui/AppButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Target, Calendar, Zap } from 'lucide-react';
import { WizardData } from './GoalWizard';
interface CompletionStepProps {
  data: WizardData;
  onComplete: () => void;
  onBack: () => void;
}
export const CompletionStep: React.FC<CompletionStepProps> = ({
  data,
  onComplete,
  onBack
}) => {
  const totalDreams = data.bucketList.length;
  const totalMediumGoals = Object.values(data.mediumTermGoals).reduce((acc, goals) => acc + goals.length, 0);
  const totalShortGoals = Object.values(data.shortTermGoals).reduce((acc, goals) => acc + goals.length, 0);
  const totalDailyHabits = Object.values(data.dailyHabits).reduce((acc, habits) => acc + habits.length, 0);
  return <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-8xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-[#374151]">Congratulations!</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          You've successfully created your personalized goal roadmap. Your dreams are now broken down into actionable steps!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center border-2 border-[#2BD192] bg-green-50">
          <CardContent className="p-4">
            <div className="text-3xl mb-2">🌟</div>
            <div className="text-2xl font-bold text-[#374151]">{totalDreams}</div>
            <div className="text-sm text-gray-600">Dreams</div>
          </CardContent>
        </Card>
        
        <Card className="text-center border-2 border-blue-400 bg-blue-50">
          <CardContent className="p-4">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-[#374151]">{totalMediumGoals}</div>
            <div className="text-sm text-gray-600">Medium Goals</div>
          </CardContent>
        </Card>
        
        <Card className="text-center border-2 border-purple-400 bg-purple-50">
          <CardContent className="p-4">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-2xl font-bold text-[#374151]">{totalShortGoals}</div>
            <div className="text-sm text-gray-600">Short Actions</div>
          </CardContent>
        </Card>
        
        <Card className="text-center border-2 border-orange-400 bg-orange-50">
          <CardContent className="p-4">
            <div className="text-3xl mb-2">🔄</div>
            <div className="text-2xl font-bold text-[#374151]">{totalDailyHabits}</div>
            <div className="text-sm text-gray-600">Daily Habits</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-[#2BD192]" />
            <span>Your Goal Roadmap Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-[#2BD192]/10 to-[#05C2FF]/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="h-4 w-4 text-[#374151]" />
              <span className="font-medium text-[#374151]">Timeline: {data.timeline} years</span>
            </div>
            
            <div className="space-y-3">
              {data.bucketList.map((dream, index) => <div key={index} className="border-l-4 border-[#2BD192] pl-4">
                  <h4 className="font-semibold text-[#374151] mb-2">🌟 {dream}</h4>
                  
                  {data.mediumTermGoals[dream] && data.mediumTermGoals[dream].length > 0 && <div className="ml-4 space-y-1">
                      {data.mediumTermGoals[dream].slice(0, 2).map((goal, goalIndex) => <div key={goalIndex} className="text-sm text-gray-600">
                          🎯 {goal}
                        </div>)}
                      {data.mediumTermGoals[dream].length > 2 && <div className="text-sm text-gray-500">
                          ... and {data.mediumTermGoals[dream].length - 2} more goals
                        </div>}
                    </div>}
                </div>)}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-r from-[#2BD192]/20 to-[#05C2FF]/20 rounded-xl p-6 border border-[#2BD192]/30">
        <div className="flex items-start space-x-3">
          <Zap className="h-6 w-6 text-[#2BD192] mt-1" />
          <div>
            <h3 className="font-bold text-[#374151] mb-2">🚀 What happens next?</h3>
            <ul className="space-y-2 text-sm text-[#374151]">
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-[#2BD192]" />
                <span>Track your daily habits and build consistency</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-[#2BD192]" />
                <span>Get AI-powered suggestions and progress insights</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-[#2BD192]" />
                <span>Monitor your progress towards your dreams</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-[#2BD192]" />
                <span>Adjust your goals as you grow and learn</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-6 pb-8">
        <AppButton onClick={onComplete} size="lg" className="bg-gradient-to-r from-[#2BD192] to-[#05C2FF] hover:from-[#2BD192]/90 hover:to-[#05C2FF]/90 text-white border-0 shadow-lg">
          🚀 Start Your Journey!
        </AppButton>
      </div>
    </div>;
};