import React from 'react';
import { useApp } from '../context/AppContext';
import { ProgressRing } from './ui/ProgressRing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, Target, Calendar } from 'lucide-react';
export const Dashboard: React.FC = () => {
  const {
    store
  } = useApp();

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

  // Get overall statistics
  const getOverallStats = () => {
    const totalDreams = store.dreams.length;
    const totalEnablers = store.dreams.reduce((acc, dream) => acc + dream.enablers.length, 0);
    const totalShortGoals = store.dreams.reduce((acc, dream) => acc + dream.enablers.reduce((enablerAcc: number, enabler: any) => enablerAcc + enabler.shortGoals.length, 0), 0);
    const completedShortGoals = store.dreams.reduce((acc, dream) => acc + dream.enablers.reduce((enablerAcc: number, enabler: any) => enablerAcc + enabler.shortGoals.filter((goal: any) => goal.done).length, 0), 0);
    return {
      totalDreams,
      totalEnablers,
      totalShortGoals,
      completedShortGoals
    };
  };
  const todayHabits = getTodayHabitsProgress();
  const stats = getOverallStats();
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

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center border-2 border-[#2BD192] bg-green-50">
          <CardContent className="p-4">
            <div className="text-2xl mb-2">🌟</div>
            <div className="text-2xl font-bold text-[#374151]">{stats.totalDreams}</div>
            <div className="text-sm text-gray-600">Dreams</div>
          </CardContent>
        </Card>
        
        <Card className="text-center border-2 border-blue-400 bg-blue-50">
          <CardContent className="p-4">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-[#374151]">{stats.totalEnablers}</div>
            <div className="text-sm text-gray-600">Medium Goals</div>
          </CardContent>
        </Card>
        
        <Card className="text-center border-2 border-purple-400 bg-purple-50">
          <CardContent className="p-4">
            <div className="text-2xl mb-2">✅</div>
            <div className="text-2xl font-bold text-[#374151]">{stats.completedShortGoals}/{stats.totalShortGoals}</div>
            <div className="text-sm text-gray-600">Tasks Done</div>
          </CardContent>
        </Card>
        
        <Card className="text-center border-2 border-orange-400 bg-orange-50">
          <CardContent className="p-4">
            <div className="text-2xl mb-2">🔄</div>
            <div className="text-2xl font-bold text-[#374151]">{todayHabits.completed}/{todayHabits.total}</div>
            <div className="text-sm text-gray-600">Today's Habits</div>
          </CardContent>
        </Card>
      </div>

      {/* Bucket List Progress */}
      

      {/* Medium-Term Goals Details */}
      

      {/* Pending Tasks */}
      

      {/* Today's Habits */}
      {todayHabits.total > 0}

      {/* Data Storage Note */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        
      </Card>
    </div>;
};