import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BottomNav } from '@/components/ui/BottomNav';

export const RDMRewardsEarnedPage: React.FC = () => {
  const navigate = useNavigate();
  const { store } = useApp();

  // Calculate base points from completed tasks and habits
  const calculateBasePoints = () => {
    const completedTasks = store.dreams.reduce((acc, dream) => 
      acc + dream.enablers.reduce((subAcc: number, enabler: any) => 
        subAcc + enabler.shortGoals.filter((goal: any) => goal.done).length, 0
      ), 0
    );
    
    const completedHabits = store.dreams.reduce((acc, dream) => 
      acc + dream.enablers.reduce((subAcc: number, enabler: any) => 
        subAcc + enabler.dailyHabits.reduce((habitAcc: number, habit: any) => habitAcc + habit.history.length, 0), 0
      ), 0
    );

    return (completedTasks * 10) + (completedHabits * 5);
  };

  const basePoints = calculateBasePoints();
  
  // Reward allocations based on wireframe
  const rewardExit = 100;
  const rewardOther = 105; 
  const remorseSelf = 10;
  
  // Calculate total allocated
  const totalAllocated = rewardExit + rewardOther + remorseSelf;
  
  // Balance calculations
  const totalBalance = basePoints - totalAllocated;
  const rewardSelfBalance = 19.5; // As shown in wireframe

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/home?tab=dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Rewards & Remorse</h1>
          </div>
        </div>

        {/* Main Rewards Form */}
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* From Base */}
            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-lg font-medium">From Base</span>
              <span className="text-lg font-bold">{basePoints}</span>
            </div>

            {/* To Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">To:</h3>
              
              <div className="space-y-3 ml-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-gray-400 rounded-full"></div>
                    <span>Reward (exit)</span>
                  </div>
                  <div className="w-16 h-8 border border-gray-300 rounded px-2 py-1 text-center bg-gray-50">
                    {rewardExit}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-gray-400 rounded-full"></div>
                    <span>Reward (other)</span>
                  </div>
                  <div className="w-16 h-8 border border-gray-300 rounded px-2 py-1 text-center bg-gray-50">
                    {rewardOther}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-gray-400 rounded-full"></div>
                    <span>Remorse (self)</span>
                  </div>
                  <div className="w-16 h-8 border border-gray-300 rounded px-2 py-1 text-center bg-gray-50">
                    {remorseSelf}
                  </div>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total Amount</span>
                <span className="text-lg font-bold">{totalAllocated}</span>
              </div>
            </div>

            {/* Balance Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Balance Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="w-12 h-8 border border-gray-300 rounded mx-auto px-1 py-1 text-sm bg-white">
                    {totalBalance}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Reward (self)</div>
                  <div className="w-12 h-8 border border-gray-300 rounded mx-auto px-1 py-1 text-sm bg-white">
                    {rewardSelfBalance}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Remorse</div>
                  <div className="w-12 h-8 border border-gray-300 rounded mx-auto px-1 py-1 text-sm bg-white">
                    {basePoints > 1300 ? (basePoints - 1300) : 0}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
};