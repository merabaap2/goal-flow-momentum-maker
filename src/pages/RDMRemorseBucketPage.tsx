import React from 'react';
import { ArrowLeft, Frown, Brain, RefreshCw, Lightbulb, AlertCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BottomNav } from '@/components/ui/BottomNav';

export const RDMRemorseBucketPage: React.FC = () => {
  const navigate = useNavigate();

  // Mock data for remorse bucket items
  const remorseItems = [
    {
      id: 1,
      goal: 'Daily meditation practice',
      missedDays: 5,
      lastMissed: '2024-01-15',
      reason: 'Too busy with work deadlines',
      severity: 'medium',
      impact: 'Feeling more stressed lately'
    },
    {
      id: 2,
      goal: 'Weekly gym sessions',
      missedDays: 3,
      lastMissed: '2024-01-14',
      reason: 'Weather was too cold',
      severity: 'low',
      impact: 'Lost some progress on fitness goals'
    },
    {
      id: 3,
      goal: 'Read for 30 minutes daily',
      missedDays: 7,
      lastMissed: '2024-01-13',
      reason: 'Got distracted by social media',
      severity: 'high',
      impact: 'Behind on learning goals for the month'
    },
  ];

  const totalMissedDays = remorseItems.reduce((sum, item) => sum + item.missedDays, 0);
  const highSeverityCount = remorseItems.filter(item => item.severity === 'high').length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
            <h1 className="text-3xl font-bold text-purple-600">RDM Remorse Bucket</h1>
            <p className="text-muted-foreground">Learn from setbacks and build resilience</p>
          </div>
        </div>

        {/* Remorse Summary */}
        <Card className="border-2 border-purple-500 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Brain className="h-5 w-5" />
              Self-Reflection Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{totalMissedDays}</div>
                <div className="text-sm text-purple-600">Total Missed Days</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-red-600">{highSeverityCount}</div>
                <div className="text-sm text-red-600">High Priority Issues</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{remorseItems.length}</div>
                <div className="text-sm text-blue-600">Learning Opportunities</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Understanding Remorse Bucket */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Lightbulb className="h-5 w-5" />
              What is the Remorse Bucket?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-blue-700">
              <p>• <strong>Learning Tool:</strong> Track missed habits and goals to understand patterns</p>
              <p>• <strong>Self-Awareness:</strong> Identify common reasons for falling off track</p>
              <p>• <strong>Growth Mindset:</strong> Turn setbacks into insights for improvement</p>
              <p>• <strong>Accountability:</strong> Face your challenges honestly and learn from them</p>
              <p>• <strong>Resilience Building:</strong> Develop strategies to overcome future obstacles</p>
            </div>
          </CardContent>
        </Card>

        {/* Recovery Actions */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <RefreshCw className="h-5 w-5" />
              Recovery Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => navigate('/home?tab=checkins')}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Restart Your Habits Today
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/simple-wizard')}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Adjust Your Goals
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Remorse Items */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Reflection Items</h2>
          {remorseItems.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent>
                <Frown className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-semibold mb-2 text-green-700">No Setbacks to Learn From!</h3>
                <p className="text-muted-foreground">You're doing great at maintaining your habits and goals!</p>
              </CardContent>
            </Card>
          ) : (
            remorseItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{item.goal}</span>
                    <Badge className={getSeverityColor(item.severity)}>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {item.severity} priority
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Missed Days:</span>
                        <span className="font-semibold ml-2">{item.missedDays}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Missed:</span>
                        <span className="font-semibold ml-2">{item.lastMissed}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Reason: </span>
                      <span className="text-sm">{item.reason}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Impact: </span>
                      <span className="text-sm italic">{item.impact}</span>
                    </div>
                    <div className="pt-2">
                      <Button size="sm" variant="outline" className="w-full">
                        <RefreshCw className="h-3 w-3 mr-2" />
                        Create Recovery Plan
                      </Button>
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