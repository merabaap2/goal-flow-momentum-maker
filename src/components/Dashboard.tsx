import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProgressRing } from './ui/ProgressRing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, CheckCircle2, XCircle, Gift, Send, Frown } from 'lucide-react';
export const Dashboard: React.FC = () => {
  const {
    store
  } = useApp();
  const navigate = useNavigate();

  // Calculate progress for each dream
  const getDreamProgress = (dream: any) => {
    const allShortGoals = dream.enablers.flatMap((enabler: any) => enabler.shortGoals);
    const completedShortGoals = allShortGoals.filter((goal: any) => goal.done).length;
    return allShortGoals.length > 0 ? Math.round(completedShortGoals / allShortGoals.length * 100) : 0;
  };

  // Calculate daily habits completion for today
  const getTodayHabitsProgress = () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const allHabits = store.dreams.flatMap(dream => dream.enablers.flatMap((enabler: any) => enabler.dailyHabits));
    const completedToday = allHabits.filter((habit: any) => habit.history.includes(today)).length;
    return {
      completed: completedToday,
      total: allHabits.length
    };
  };

  // Get new dashboard statistics
  const getNewDashboardStats = () => {
    const totalGoals = store.dreams.length; // Total bucket list items/goals

    // Calculate successful goals based on completed enablers/medium goals
    const successfulGoals = store.dreams.filter(dream => {
      const totalShortGoals = dream.enablers.reduce((acc, enabler) => acc + enabler.shortGoals.length, 0);
      const completedShortGoals = dream.enablers.reduce((acc, enabler) => acc + enabler.shortGoals.filter(goal => goal.done).length, 0);
      // Consider a dream successful if more than 80% of its short goals are completed
      return totalShortGoals > 0 && completedShortGoals / totalShortGoals >= 0.8;
    }).length;
    const failedGoals = 0; // For now, we'll consider this as goals that are overdue or marked as failed
    const rdmRewardsEarned = 0; // Placeholder - this would come from your RDM system
    const rdmRewardsGiven = 0; // Placeholder - this would come from your RDM system
    const rdmRemorseBucket = 0; // Placeholder - this would come from your RDM system

    return {
      totalGoals,
      successfulGoals,
      failedGoals,
      rdmRewardsEarned,
      rdmRewardsGiven,
      rdmRemorseBucket
    };
  };
  const todayHabits = getTodayHabitsProgress();
  const newStats = getNewDashboardStats();
  if (store.dreams.length === 0) {
    return <div className="p-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#374151]">Your Progress</h1>
          <p className="text-gray-600">Track your journey towards your dreams</p>
        </div>
        <Card className="text-center p-8">
          <CardContent>
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-[#374151] mb-2">No Goals Yet</h3>
            <p className="text-gray-600">Complete the goal wizard to start tracking your progress!</p>
          </CardContent>
        </Card>
      </div>;
  }
  return <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-[#374151]">Your Progress</h1>
        <p className="text-gray-600">Track your journey towards your dreams</p>
      </div>

      {/* New Dashboard Stats - 3x2 Grid Layout */}
      <div className="space-y-4">
        {/* First Row - Goals Related */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center border-2 border-primary bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => navigate('/goals-overview')}>
            <CardContent className="p-4">
              <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{newStats.totalGoals}</div>
              <div className="text-sm text-muted-foreground">No. of Goals</div>
            </CardContent>
          </Card>
          
          <Card className="text-center border-2 border-green-500 bg-green-50 cursor-pointer hover:bg-green-100 transition-colors" onClick={() => navigate('/goals-success')}>
            <CardContent className="p-4">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-foreground">{newStats.successfulGoals}</div>
              <div className="text-sm text-muted-foreground">No. of Goals Success</div>
            </CardContent>
          </Card>
          
          <Card className="text-center border-2 border-red-500 bg-red-50 cursor-pointer hover:bg-red-100 transition-colors" onClick={() => navigate('/goals-failed')}>
            <CardContent className="p-4">
              <XCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold text-foreground">{newStats.failedGoals}</div>
              <div className="text-sm text-muted-foreground">No. of Goals Failed</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Second Row - RDM Related */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center border-2 border-amber-500 bg-amber-50 cursor-pointer hover:bg-amber-100 transition-colors" onClick={() => navigate('/rdm-rewards-earned')}>
            <CardContent className="p-4">
              <Gift className="h-8 w-8 mx-auto mb-2 text-amber-600" />
              <div className="text-2xl font-bold text-foreground">{newStats.rdmRewardsEarned}</div>
              <div className="text-sm text-muted-foreground">RDM Rewards Earned</div>
            </CardContent>
          </Card>
          
          <Card className="text-center border-2 border-blue-500 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => navigate('/rdm-rewards-given')}>
            <CardContent className="p-4">
              <Send className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-foreground">{newStats.rdmRewardsGiven}</div>
              <div className="text-sm text-muted-foreground">RDM Rewards Given</div>
            </CardContent>
          </Card>
          
          <Card className="text-center border-2 border-purple-500 bg-purple-50 cursor-pointer hover:bg-purple-100 transition-colors" onClick={() => navigate('/rdm-remorse-bucket')}>
            <CardContent className="p-4">
              <Frown className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-foreground">{newStats.rdmRemorseBucket}</div>
              <div className="text-sm text-muted-foreground">RDM Remorse Bucket</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bucket List Progress */}
      

      {/* Medium-Term Dreams Details */}
      

      {/* Pending Tasks */}
      

      {/* Today's Habits */}
      {todayHabits.total > 0 && <Card>
          
          
        </Card>}
    </div>;
};