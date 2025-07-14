import React, { useState } from 'react';
import { ArrowLeft, Target, Plus, Calendar, CheckCircle, Star, TrendingUp, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BottomNav } from '@/components/ui/BottomNav';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
export const GoalsOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    store
  } = useApp();
  const [activeTab, setActiveTab] = useState("bucket-list");
  const getGoalProgress = (dream: any) => {
    const allShortGoals = dream.enablers.flatMap((enabler: any) => enabler.shortGoals);
    const completedShortGoals = allShortGoals.filter((goal: any) => goal.done).length;
    return allShortGoals.length > 0 ? Math.round(completedShortGoals / allShortGoals.length * 100) : 0;
  };
  const getAllMediumGoals = () => {
    return store.dreams.flatMap(dream => dream.enablers.map((enabler: any) => ({
      ...enabler,
      dreamTitle: dream.text,
      dreamId: dream.id
    })));
  };
  const getAllShortGoals = () => {
    return store.dreams.flatMap(dream => dream.enablers.flatMap((enabler: any) => enabler.shortGoals.map((goal: any) => ({
      ...goal,
      dreamTitle: dream.text,
      mediumGoalTitle: enabler.text,
      dreamId: dream.id,
      enablerColor: enabler.color
    }))));
  };
  return <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/home?tab=dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">BucketList Overview</h1>
            <p className="text-muted-foreground">Track all your bucket list dreams and goals</p>
          </div>
        </div>

        {/* Goals Summary */}
        

        {/* Interactive Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          

          {/* Bucket List Tab */}
          <TabsContent value="bucket-list" className="space-y-4">
            {store.dreams.length === 0 ? <Card className="text-center p-8">
                <CardContent>
                  <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Bucket List Items Yet</h3>
                  <p className="text-muted-foreground mb-4">Start your journey by creating your first dream!</p>
                  <Button onClick={() => navigate('/simple-wizard')} className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Dream
                  </Button>
                </CardContent>
              </Card> : store.dreams.map((dream: any) => {
            const progress = getGoalProgress(dream);
            return;
          })}
          </TabsContent>

          {/* Medium Goals Tab */}
          <TabsContent value="medium-goals" className="space-y-4">
            {getAllMediumGoals().length === 0 ? <Card className="text-center p-8">
                <CardContent>
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Medium Goals Yet</h3>
                  <p className="text-muted-foreground">Medium goals will appear when you create bucket list items.</p>
                </CardContent>
              </Card> : getAllMediumGoals().map((enabler: any, index: number) => <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
                  
                  
                </Card>)}
          </TabsContent>

          {/* Short Goals Tab */}
          <TabsContent value="short-goals" className="space-y-4">
            {getAllShortGoals().length === 0 ? <Card className="text-center p-8">
                <CardContent>
                  <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Short Goals Yet</h3>
                  <p className="text-muted-foreground">Short-term actions will appear when you create medium goals.</p>
                </CardContent>
              </Card> : getAllShortGoals().map((goal: any, index: number) => <Card key={index} className={`hover:shadow-lg transition-all duration-300 border-l-4 ${goal.done ? 'border-l-green-500 bg-green-50/50' : 'border-l-purple-500'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Activity className={`h-4 w-4 ${goal.done ? 'text-green-500' : 'text-purple-500'}`} />
                        <div>
                          <div className={`font-medium ${goal.done ? 'line-through text-muted-foreground' : ''}`}>
                            {goal.text}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {goal.mediumGoalTitle} • {goal.dreamTitle}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {goal.done && <CheckCircle className="h-5 w-5 text-green-500" />}
                        <Badge variant={goal.done ? "default" : "secondary"} className="text-xs">
                          {goal.done ? 'Completed' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
          </TabsContent>
        </Tabs>
      </div>
      <BottomNav />
    </div>;
};