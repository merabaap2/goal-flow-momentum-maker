import React from 'react';
import { ArrowLeft, Target, Plus, Calendar, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BottomNav } from '@/components/ui/BottomNav';

export const GoalsOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { store } = useApp();

  const getGoalProgress = (dream: any) => {
    const allShortGoals = dream.enablers.flatMap((enabler: any) => enabler.shortGoals);
    const completedShortGoals = allShortGoals.filter((goal: any) => goal.done).length;
    return allShortGoals.length > 0 ? Math.round(completedShortGoals / allShortGoals.length * 100) : 0;
  };

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
            <h1 className="text-3xl font-bold">Goals Overview</h1>
            <p className="text-muted-foreground">Track all your bucket list dreams and goals</p>
          </div>
        </div>

        {/* Goals Summary */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Total Goals: {store.dreams.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{store.dreams.length}</div>
                <div className="text-sm text-blue-600">Active Dreams</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {store.dreams.reduce((acc, dream) => acc + dream.enablers.length, 0)}
                </div>
                <div className="text-sm text-green-600">Medium-term Goals</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {store.dreams.reduce((acc, dream) => 
                    acc + dream.enablers.reduce((subAcc: number, enabler: any) => subAcc + enabler.shortGoals.length, 0), 0
                  )}
                </div>
                <div className="text-sm text-purple-600">Short-term Actions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Individual Goals */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Dreams & Goals</h2>
          {store.dreams.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent>
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Goals Yet</h3>
                <p className="text-muted-foreground mb-4">Start your journey by creating your first goal!</p>
                <Button onClick={() => navigate('/simple-wizard')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            store.dreams.map((dream: any) => {
              const progress = getGoalProgress(dream);
              return (
                <Card key={dream.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{dream.text}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{progress}%</span>
                        {progress === 100 && <CheckCircle className="h-5 w-5 text-green-500" />}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Progress value={progress} className="h-2" />
                      <div className="text-sm text-muted-foreground">
                        {dream.enablers.length} medium-term goals • {
                          dream.enablers.reduce((acc: number, enabler: any) => acc + enabler.shortGoals.length, 0)
                        } actions
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