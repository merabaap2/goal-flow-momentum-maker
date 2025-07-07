
import React from 'react';
import { useApp } from '../context/AppContext';
import { ProgressRing } from './ui/ProgressRing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, Target, Calendar } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { store } = useApp();

  // Calculate progress for each dream
  const getDreamProgress = (dream: any) => {
    const allShortGoals = dream.enablers.flatMap((enabler: any) => enabler.shortGoals);
    const completedShortGoals = allShortGoals.filter((goal: any) => goal.done).length;
    return allShortGoals.length > 0 ? Math.round((completedShortGoals / allShortGoals.length) * 100) : 0;
  };

  // Calculate daily habits completion for today
  const getTodayHabitsProgress = () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const allHabits = store.dreams.flatMap(dream => 
      dream.enablers.flatMap((enabler: any) => enabler.dailyHabits)
    );
    const completedToday = allHabits.filter((habit: any) => 
      habit.history.includes(today)
    ).length;
    return { completed: completedToday, total: allHabits.length };
  };

  // Get overall statistics
  const getOverallStats = () => {
    const totalDreams = store.dreams.length;
    const totalEnablers = store.dreams.reduce((acc, dream) => acc + dream.enablers.length, 0);
    const totalShortGoals = store.dreams.reduce((acc, dream) => 
      acc + dream.enablers.reduce((enablerAcc: number, enabler: any) => 
        enablerAcc + enabler.shortGoals.length, 0), 0);
    const completedShortGoals = store.dreams.reduce((acc, dream) => 
      acc + dream.enablers.reduce((enablerAcc: number, enabler: any) => 
        enablerAcc + enabler.shortGoals.filter((goal: any) => goal.done).length, 0), 0);
    
    return { totalDreams, totalEnablers, totalShortGoals, completedShortGoals };
  };

  const todayHabits = getTodayHabitsProgress();
  const stats = getOverallStats();

  if (store.dreams.length === 0) {
    return (
      <div className="p-4 space-y-6">
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
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">🪣</span>
            <span>Bucket List Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {store.dreams.map((dream, index) => (
              <Card key={dream.id} className="text-center hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600 line-clamp-2">
                    {dream.text}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <ProgressRing 
                    percent={getDreamProgress(dream)} 
                    color={index % 2 === 0 ? '#2BD192' : '#05C2FF'}
                    size={80}
                  />
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {getDreamProgress(dream) === 100 ? 'Complete' : 
                     getDreamProgress(dream) > 0 ? 'In Progress' : 'Not Started'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medium-Term Goals Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-500" />
            <span>Medium-Term Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {store.dreams.map((dream) => (
              dream.enablers.map((enabler, enablerIndex) => (
                <div key={enabler.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-[#374151]">{enabler.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {dream.text}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Progress 
                        value={enabler.shortGoals.length > 0 ? 
                          (enabler.shortGoals.filter((goal: any) => goal.done).length / enabler.shortGoals.length) * 100 : 0}
                        className="h-2"
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      {enabler.shortGoals.filter((goal: any) => goal.done).length}/{enabler.shortGoals.length} tasks
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    {enabler.dailyHabits.length} daily habits
                  </div>
                </div>
              ))
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-500" />
            <span>Pending Tasks</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {store.dreams.flatMap(dream => 
              dream.enablers.flatMap((enabler: any) => 
                enabler.shortGoals
                  .filter((goal: any) => !goal.done)
                  .slice(0, 5) // Show only first 5 pending tasks
                  .map((goal: any) => (
                    <div key={goal.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#374151]">{goal.detail}</p>
                        <p className="text-xs text-gray-500">{enabler.name}</p>
                      </div>
                    </div>
                  ))
              )
            ).slice(0, 5)}
            
            {store.dreams.flatMap(dream => 
              dream.enablers.flatMap((enabler: any) => 
                enabler.shortGoals.filter((goal: any) => !goal.done)
              )
            ).length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-gray-600">All tasks completed!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Today's Habits */}
      {todayHabits.total > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <span>Today's Habits</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <ProgressRing 
                percent={todayHabits.total > 0 ? Math.round((todayHabits.completed / todayHabits.total) * 100) : 0}
                color="#2BD192"
                size={120}
              />
              <p className="text-gray-600 mt-4">
                {todayHabits.completed} of {todayHabits.total} habits completed today
              </p>
            </div>
            
            <div className="space-y-3">
              {store.dreams.flatMap(dream => 
                dream.enablers.flatMap((enabler: any) => 
                  enabler.dailyHabits.map((habit: any) => {
                    const today = new Date().toISOString().split('T')[0];
                    const isCompletedToday = habit.history.includes(today);
                    
                    return (
                      <div key={habit.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${isCompletedToday ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#374151]">{habit.detail}</p>
                          <p className="text-xs text-gray-500">
                            {habit.streak} day streak • {enabler.name}
                          </p>
                        </div>
                        {isCompletedToday && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    );
                  })
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Storage Note */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">📊 Data Storage</h4>
              <p className="text-sm text-blue-700">
                Your goals are currently stored locally. Connect to Supabase to sync across devices and enable real-time collaboration.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
