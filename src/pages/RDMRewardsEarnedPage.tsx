import React, { useState } from 'react';
import { ArrowLeft, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BottomNav } from '@/components/ui/BottomNav';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Contact {
  id: string;
  name: string;
  email: string;
}

export const RDMRewardsEarnedPage: React.FC = () => {
  const navigate = useNavigate();
  const { store } = useApp();
  
  // State management
  const [selectedReward, setSelectedReward] = useState<string>('');
  const [rewardAmount, setRewardAmount] = useState<number>(0);
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [balanceCalculated, setBalanceCalculated] = useState<boolean>(false);

  // Dummy contact data
  const contacts: Contact[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Sarah Smith', email: 'sarah@example.com' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
    { id: '4', name: 'Emily Davis', email: 'emily@example.com' },
    { id: '5', name: 'Alex Wilson', email: 'alex@example.com' },
  ];

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

  // Handle reward selection
  const handleRewardSelection = (type: string, amount: number) => {
    setSelectedReward(type);
    setRewardAmount(amount);
  };

  // Handle submit
  const handleSubmit = () => {
    if (selectedReward && rewardAmount > 0) {
      setBalanceCalculated(true);
    }
  };

  // Calculate balance summary after submit
  const getBalanceSummary = () => {
    if (!balanceCalculated) {
      return { total: 0, rewardSelf: 0, remorse: 0 };
    }
    
    const total = basePoints - rewardAmount;
    const rewardSelf = selectedReward === 'self' ? rewardAmount : 0;
    const remorse = selectedReward === 'self' ? 0 : Math.max(0, rewardAmount - 50);
    
    return { total, rewardSelf, remorse };
  };

  const balanceSummary = getBalanceSummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/home?tab=dashboard')}
            className="rounded-full shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Rewards & Remorse</h1>
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 space-y-8">
            {/* From Base Section */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <span className="text-lg font-semibold text-green-800">From Base</span>
              <span className="text-2xl font-bold text-green-700">{basePoints}</span>
            </div>

            {/* To Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">To:</h3>
              
              <div className="space-y-4">
                {/* Reward (exit) */}
                <div 
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedReward === 'exit' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                  onClick={() => handleRewardSelection('exit', 100)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedReward === 'exit' 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-400'
                    }`}>
                      {selectedReward === 'exit' && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                    </div>
                    <span className="font-medium">Reward (exit)</span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-md border font-semibold text-gray-700">
                    100
                  </div>
                </div>

                {/* Reward (other) */}
                <div 
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedReward === 'other' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                  onClick={() => handleRewardSelection('other', 105)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedReward === 'other' 
                        ? 'border-purple-500 bg-purple-500' 
                        : 'border-gray-400'
                    }`}>
                      {selectedReward === 'other' && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                    </div>
                    <span className="font-medium">Reward (
                      <Select value={selectedContact} onValueChange={setSelectedContact}>
                        <SelectTrigger className="inline-flex w-auto h-6 px-2 py-0 text-sm border-0 bg-purple-100 text-purple-700 hover:bg-purple-200">
                          <SelectValue placeholder="other" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                          {contacts.map((contact) => (
                            <SelectItem key={contact.id} value={contact.id} className="hover:bg-gray-100">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <div>
                                  <div className="font-medium">{contact.name}</div>
                                  <div className="text-xs text-gray-500">{contact.email}</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )</span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-md border font-semibold text-gray-700">
                    105
                  </div>
                </div>

                {/* Reward (self) */}
                <div 
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedReward === 'self' 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                  onClick={() => handleRewardSelection('self', 10)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedReward === 'self' 
                        ? 'border-orange-500 bg-orange-500' 
                        : 'border-gray-400'
                    }`}>
                      {selectedReward === 'self' && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                    </div>
                    <span className="font-medium">Remorse (self)</span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-md border font-semibold text-gray-700">
                    10
                  </div>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border-t-2 border-gray-300">
              <span className="text-lg font-semibold text-gray-800">Total Amount</span>
              <span className="text-2xl font-bold text-gray-700">{rewardAmount}</span>
            </div>

            {/* Submit Button */}
            <Button 
              onClick={handleSubmit}
              disabled={!selectedReward || rewardAmount === 0}
              className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-200"
            >
              Calculate Balance
            </Button>

            {/* Balance Summary */}
            {balanceCalculated && (
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200 animate-fade-in">
                <h3 className="text-lg font-semibold mb-4 text-indigo-800">Balance Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-2">Total</div>
                    <div className="bg-white border border-gray-200 rounded-lg py-3 px-2 font-bold text-lg text-gray-800">
                      {balanceSummary.total}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-2">Reward (self)</div>
                    <div className="bg-white border border-gray-200 rounded-lg py-3 px-2 font-bold text-lg text-green-600">
                      {balanceSummary.rewardSelf}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-2">Remorse</div>
                    <div className="bg-white border border-gray-200 rounded-lg py-3 px-2 font-bold text-lg text-red-600">
                      {balanceSummary.remorse}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
};