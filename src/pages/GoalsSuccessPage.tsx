import React from 'react';
import { ArrowLeft, CheckCircle2, Trophy, Calendar, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/ui/BottomNav';

export const GoalsSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { store } = useApp();

  const getSuccessfulGoals = () => {
    return store.dreams.filter(dream => {
      const totalShortGoals = dream.enablers.reduce((acc, enabler) => acc + enabler.shortGoals.length, 0);
      const completedShortGoals = dream.enablers.reduce((acc, enabler) => acc + enabler.shortGoals.filter(goal => goal.done).length, 0);
      return totalShortGoals > 0 && (completedShortGoals / totalShortGoals) >= 0.8;
    });
  };

  const successfulGoals = getSuccessfulGoals();
  const totalCompletedTasks = store.dreams.reduce((acc, dream) => 
    acc + dream.enablers.reduce((subAcc: number, enabler: any) => 
      subAcc + enabler.shortGoals.filter((goal: any) => goal.done).length, 0
    ), 0
  );

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
            <h1 className="text-3xl font-bold text-green-600">Successful Goals</h1>
            <p className="text-muted-foreground">Celebrate your achievements and progress</p>
          </div>
        </div>

        {/* Success Statistics */}
        <Card className="border-2 border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Trophy className="h-5 w-5" />
              Success Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-green-600">{successfulGoals.length}</div>
                <div className="text-sm text-green-600">Goals 80%+ Complete</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-green-600">{totalCompletedTasks}</div>
                <div className="text-sm text-green-600">Tasks Completed</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {store.dreams.length > 0 ? Math.round((successfulGoals.length / store.dreams.length) * 100) : 0}%
                </div>
                <div className="text-sm text-green-600">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Successful Goals List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Achievements</h2>
          {successfulGoals.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent>
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Completed Goals Yet</h3>
                <p className="text-muted-foreground">Keep working on your goals to see your achievements here!</p>
              </CardContent>
            </Card>
          ) : (
            successfulGoals.map((dream: any) => {
              const totalShortGoals = dream.enablers.reduce((acc: number, enabler: any) => acc + enabler.shortGoals.length, 0);
              const completedShortGoals = dream.enablers.reduce((acc: number, enabler: any) => acc + enabler.shortGoals.filter((goal: any) => goal.done).length, 0);
              const progress = Math.round((completedShortGoals / totalShortGoals) * 100);
              
              return (
                <Card key={dream.id} className="border-2 border-green-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{dream.text}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Star className="h-3 w-3 mr-1" />
                        {progress}% Complete
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Progress value={progress} className="h-3" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{completedShortGoals} of {totalShortGoals} tasks completed</span>
                        <span className="text-green-600 font-medium">Excellent Progress!</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};