
import React from 'react';
import { useApp } from '../context/AppContext';
import { ProgressRing } from './ui/ProgressRing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Dashboard: React.FC = () => {
  const { store } = useApp();

  // Calculate progress for each dream's enablers (medium-term goals)
  const getEnablerProgress = (enabler: any) => {
    const totalShortGoals = enabler.shortGoals.length;
    const completedShortGoals = enabler.shortGoals.filter((goal: any) => goal.done).length;
    return totalShortGoals > 0 ? Math.round((completedShortGoals / totalShortGoals) * 100) : 0;
  };

  // Get all enablers from all dreams for the progress rings
  const allEnablers = store.dreams.flatMap(dream => dream.enablers);
  const topEnablers = allEnablers.slice(0, 3); // Show top 3 enablers

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-[#374151]">Your Progress</h1>
        <p className="text-gray-600">Track your journey towards your dreams</p>
      </div>

      {/* Progress Rings for Enablers (Medium-term goals) */}
      {topEnablers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topEnablers.map((enabler, index) => (
            <Card key={enabler.id} className="text-center hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  {enabler.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <ProgressRing 
                  percent={getEnablerProgress(enabler)} 
                  color={index % 2 === 0 ? '#2BD192' : '#05C2FF'}
                  size={100}
                />
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {getEnablerProgress(enabler) > 0 ? 'In Progress' : 'Not Started'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center p-8">
          <CardContent>
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-[#374151] mb-2">No Goals Yet</h3>
            <p className="text-gray-600">Complete the goal wizard to start tracking your progress!</p>
          </CardContent>
        </Card>
      )}

      {/* Dreams Overview */}
      {store.dreams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Dreams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {store.dreams.map((dream, index) => (
                <div key={dream.id} className="p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-[#374151]">{dream.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
