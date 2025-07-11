import React from 'react';
import { ArrowLeft, Send, Users, Heart, HandHeart, Plus, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/ui/BottomNav';

export const RDMRewardsGivenPage: React.FC = () => {
  const navigate = useNavigate();

  // Mock data for rewards given to others
  const rewardsGiven = [
    {
      id: 1,
      recipient: 'Sarah M.',
      points: 25,
      reason: 'Helped me stay motivated with my fitness goals',
      date: '2024-01-15',
      type: 'Motivation Support'
    },
    {
      id: 2,
      recipient: 'Alex K.',
      points: 15,
      reason: 'Shared great productivity tips',
      date: '2024-01-14',
      type: 'Knowledge Sharing'
    },
    {
      id: 3,
      recipient: 'Jamie L.',
      points: 30,
      reason: 'Amazing accountability partner',
      date: '2024-01-13',
      type: 'Accountability'
    },
  ];

  const totalGiven = rewardsGiven.reduce((sum, reward) => sum + reward.points, 0);
  const recipientCount = new Set(rewardsGiven.map(r => r.recipient)).size;

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
            <h1 className="text-3xl font-bold text-blue-600">RDM Rewards Given</h1>
            <p className="text-muted-foreground">Spread motivation and appreciation to others</p>
          </div>
        </div>

        {/* Giving Summary */}
        <Card className="border-2 border-blue-500 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <HandHeart className="h-5 w-5" />
              Your Generosity Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{totalGiven}</div>
                <div className="text-sm text-blue-600">Total Points Given</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-green-600">{recipientCount}</div>
                <div className="text-sm text-green-600">People Helped</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{rewardsGiven.length}</div>
                <div className="text-sm text-purple-600">Rewards Sent</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Give Rewards Action */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Plus className="h-5 w-5" />
              Give Rewards to Others
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700 mb-4">
              Recognize someone who helped you with your goals or inspired your journey!
            </p>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4 mr-2" />
              Send Reward Points
            </Button>
          </CardContent>
        </Card>

        {/* Why Give Rewards */}
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Heart className="h-5 w-5" />
              Why Give RDM Rewards?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-purple-700">
              <p>• <strong>Build Community:</strong> Strengthen your support network</p>
              <p>• <strong>Show Gratitude:</strong> Acknowledge those who help you succeed</p>
              <p>• <strong>Motivate Others:</strong> Encourage friends to pursue their goals</p>
              <p>• <strong>Create Accountability:</strong> Build mutual goal-achievement partnerships</p>
              <p>• <strong>Pay It Forward:</strong> Spread the culture of goal achievement</p>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Given History */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Rewards Given</h2>
          {rewardsGiven.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent>
                <Send className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Rewards Given Yet</h3>
                <p className="text-muted-foreground">Start building your support community by recognizing others!</p>
              </CardContent>
            </Card>
          ) : (
            rewardsGiven.map((reward) => (
              <Card key={reward.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold flex items-center gap-2">
                          {reward.recipient}
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {reward.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{reward.reason}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{reward.points} pts</div>
                      <div className="text-xs text-muted-foreground">{reward.date}</div>
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