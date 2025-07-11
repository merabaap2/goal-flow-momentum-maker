import React from 'react';
import { ArrowLeft, XCircle, AlertTriangle, RefreshCw, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/ui/BottomNav';

export const GoalsFailedPage: React.FC = () => {
  const navigate = useNavigate();
  const { store } = useApp();

  const getStrugglingGoals = () => {
    return store.dreams.filter(dream => {
      const totalShortGoals = dream.enablers.reduce((acc, enabler) => acc + enabler.shortGoals.length, 0);
      const completedShortGoals = dream.enablers.reduce((acc, enabler) => acc + enabler.shortGoals.filter(goal => goal.done).length, 0);
      return totalShortGoals > 0 && (completedShortGoals / totalShortGoals) < 0.3; // Less than 30% complete
    });
  };

  const strugglingGoals = getStrugglingGoals();
  const stuckGoals = store.dreams.filter(dream => {
    const totalShortGoals = dream.enablers.reduce((acc, enabler) => acc + enabler.shortGoals.length, 0);
    const completedShortGoals = dream.enablers.reduce((acc, enabler) => acc + enabler.shortGoals.filter(goal => goal.done).length, 0);
    return totalShortGoals > 0 && completedShortGoals === 0; // 0% complete
  });

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
            <h1 className="text-3xl font-bold text-red-600">Goals Needing Attention</h1>
            <p className="text-muted-foreground">Identify and restart stalled goals</p>
          </div>
        </div>

        {/* Struggling Goals Statistics */}
        <Card className="border-2 border-red-500 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Goals Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-red-600">{strugglingGoals.length}</div>
                <div className="text-sm text-red-600">Goals &lt;30% Complete</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{stuckGoals.length}</div>
                <div className="text-sm text-orange-600">Goals Not Started</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">
                  {store.dreams.length - strugglingGoals.length}
                </div>
                <div className="text-sm text-yellow-600">Goals On Track</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivation Card */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <RefreshCw className="h-5 w-5" />
              Recovery Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>• Break down large goals into smaller, manageable tasks</p>
              <p>• Set daily reminders for goal-related activities</p>
              <p>• Review and adjust timelines if needed</p>
              <p>• Celebrate small wins to build momentum</p>
              <p>• Consider finding an accountability partner</p>
            </div>
          </CardContent>
        </Card>

        {/* Struggling Goals List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Goals That Need Your Attention</h2>
          {strugglingGoals.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent>
                <XCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-semibold mb-2 text-green-700">Great Job!</h3>
                <p className="text-muted-foreground">All your goals are making good progress. Keep it up!</p>
              </CardContent>
            </Card>
          ) : (
            strugglingGoals.map((dream: any) => {
              const totalShortGoals = dream.enablers.reduce((acc: number, enabler: any) => acc + enabler.shortGoals.length, 0);
              const completedShortGoals = dream.enablers.reduce((acc: number, enabler: any) => acc + enabler.shortGoals.filter((goal: any) => goal.done).length, 0);
              const progress = totalShortGoals > 0 ? Math.round((completedShortGoals / totalShortGoals) * 100) : 0;
              
              return (
                <Card key={dream.id} className="border-2 border-red-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{dream.text}</span>
                      <Badge variant="destructive" className="bg-red-100 text-red-800">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        {progress}% Complete
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Progress value={progress} className="h-3" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{completedShortGoals} of {totalShortGoals} tasks completed</span>
                        <span className="text-red-600 font-medium">Needs Attention</span>
                      </div>
                      <Button size="sm" className="w-full" onClick={() => navigate('/home?tab=checkins')}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Restart This Goal
                      </Button>
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