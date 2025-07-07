import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';

export const ProgressTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-[#374151]">Progress Analytics</h2>
        <p className="text-gray-600">Track your journey towards your dreams</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#2BD192]/10 to-[#2BD192]/5">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-[#2BD192] to-[#05C2FF] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#374151] mb-1">0</h3>
            <p className="text-sm text-gray-600">Goals Completed</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#374151] mb-1">0%</h3>
            <p className="text-sm text-gray-600">Overall Progress</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#374151] mb-1">0</h3>
            <p className="text-sm text-gray-600">Days Streak</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#374151] mb-1">0</h3>
            <p className="text-sm text-gray-600">Achievements</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-[#374151]">Progress Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-[#374151] mb-2">Detailed Analytics</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Complete your goal setup to unlock powerful progress tracking, visual charts, and AI-powered insights.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};