import React from 'react';
import { ArrowLeft, Gift, Star, Calendar, Coins, Trophy, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/ui/BottomNav';

export const RDMRewardsEarnedPage: React.FC = () => {
  const navigate = useNavigate();
  const { store } = useApp();

  // Calculate rewards based on completed tasks
  const calculateEarnedRewards = () => {
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

    return {
      totalPoints: (completedTasks * 10) + (completedHabits * 5),
      taskRewards: completedTasks * 10,
      habitRewards: completedHabits * 5,
      badges: Math.floor(completedTasks / 5), // 1 badge per 5 completed tasks
      streakBonus: Math.floor(completedHabits / 7) * 50 // Weekly streak bonus
    };
  };

  const rewards = calculateEarnedRewards();

  const rewardHistory = [
    { id: 1, type: 'Task Completion', points: 10, description: 'Completed a short-term action', date: '2024-01-15', icon: Trophy },
    { id: 2, type: 'Habit Streak', points: 50, description: '7-day habit streak bonus', date: '2024-01-14', icon: Zap },
    { id: 3, type: 'Goal Milestone', points: 100, description: 'Reached 50% of a major goal', date: '2024-01-13', icon: Star },
  ];

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
            <h1 className="text-3xl font-bold text-amber-600">RDM Rewards Earned</h1>
            <p className="text-muted-foreground">Your achievements and reward points</p>
          </div>
        </div>

        {/* Total Rewards Summary */}
        <Card className="border-2 border-amber-500 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <Coins className="h-5 w-5" />
              Your Reward Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-amber-600 mb-2">{rewards.totalPoints}</div>
              <div className="text-amber-700 font-medium">Total RDM Points</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{rewards.taskRewards}</div>
                <div className="text-xs text-blue-600">Task Points</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600">{rewards.habitRewards}</div>
                <div className="text-xs text-green-600">Habit Points</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{rewards.badges}</div>
                <div className="text-xs text-purple-600">Badges Earned</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{rewards.streakBonus}</div>
                <div className="text-xs text-orange-600">Streak Bonus</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reward System Explanation */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Gift className="h-5 w-5" />
              How You Earn RDM Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2 bg-white rounded">
                <span>Complete a short-term action</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">+10 points</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded">
                <span>Daily habit check-in</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">+5 points</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded">
                <span>7-day habit streak</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">+50 bonus</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded">
                <span>Complete 5 tasks (badge)</span>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">+25 bonus</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Rewards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Rewards</h2>
          {rewardHistory.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent>
                <Gift className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Rewards Yet</h3>
                <p className="text-muted-foreground">Complete tasks and build habits to start earning rewards!</p>
              </CardContent>
            </Card>
          ) : (
            rewardHistory.map((reward) => (
              <Card key={reward.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-full">
                        <reward.icon className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-semibold">{reward.type}</div>
                        <div className="text-sm text-muted-foreground">{reward.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-amber-600">+{reward.points}</div>
                      <div className="text-xs text-muted-foreground">{reward.date}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};