
import React from 'react';
import { useApp } from '../context/AppContext';
import { ProgressRing } from './ui/ProgressRing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Dashboard: React.FC = () => {
  const { store } = useApp();

  // Mock data for demonstration
  const mockMilestones = [
    { name: 'Learn React', progress: 75, color: '#2BD192' },
    { name: 'Build Portfolio', progress: 45, color: '#05C2FF' },
    { name: 'Job Applications', progress: 30, color: '#2BD192' },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-[#374151]">Your Progress</h1>
        <p className="text-gray-600">Track your journey towards your dreams</p>
      </div>

      {/* Progress Rings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockMilestones.map((milestone, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                {milestone.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <ProgressRing 
                percent={milestone.progress} 
                color={milestone.color}
                size={100}
              />
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                On Track
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

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
