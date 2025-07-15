import React from 'react';
import { ArrowLeft, Target, Star, TrendingUp, Activity, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BottomNav } from '@/components/ui/BottomNav';
import { Badge } from '@/components/ui/badge';
export const GoalsOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    store
  } = useApp();
  return <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/home?tab=dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Total Bucket List Overview</h1>
          </div>
        </div>

        {/* Summary Stats */}
        

        {/* Goals Overview */}
        <div className="space-y-6">
          {/* Bucket List Section */}
          <Card className="hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                Bucket List Dreams
                <Badge variant="secondary" className="ml-auto">
                  {store.dreams.length} {store.dreams.length === 1 ? 'Dream' : 'Dreams'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {store.dreams.length > 0 ? store.dreams.map((dream: any, index: number) => <div key={index} className="p-4 bg-secondary/30 rounded-lg border border-border/50 hover:bg-secondary/50 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-primary/20 rounded-full mt-1 group-hover:bg-primary/30 transition-colors">
                        <Target className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {dream.text}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Big picture dream • Long-term aspiration
                        </p>
                      </div>
                    </div>
                  </div>) : <div className="text-center py-8">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No bucket list dreams yet</p>
                  <p className="text-sm text-muted-foreground/70">Start by creating your first dream!</p>
                </div>}
            </CardContent>
          </Card>

          {/* Medium Term Dreams Section */}
          <Card className="hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-blue-500/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                Medium Term Dreams
                <Badge variant="secondary" className="ml-auto">
                  {store.dreams.reduce((acc: number, dream: any) => acc + (dream.enablers?.length || 0), 0)} Goals
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {store.dreams.length > 0 && store.dreams.some((dream: any) => dream.enablers?.length > 0) ? store.dreams.map((dream: any) => dream.enablers?.map((enabler: any, index: number) => <div key={index} className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200/30 dark:border-blue-800/30 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300 cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-blue-500/20 rounded-full mt-1 group-hover:bg-blue-500/30 transition-colors">
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {enabler.name || enabler.text}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Stepping stone • {dream.text}
                          </p>
                        </div>
                      </div>
                    </div>)) : <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No medium term dreams yet</p>
                  <p className="text-sm text-muted-foreground/70">Goals will appear when you create dreams</p>
                </div>}
            </CardContent>
          </Card>

          {/* Short Term Dreams Section */}
          <Card className="hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-green-500/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-green-500/10 rounded-full">
                  <Clock className="h-6 w-6 text-green-500" />
                </div>
                Short Term Actions
                <Badge variant="secondary" className="ml-auto">
                  {store.dreams.reduce((acc: number, dream: any) => acc + (dream.enablers?.reduce((enablerAcc: number, enabler: any) => enablerAcc + (enabler.shortGoals?.length || 0), 0) || 0), 0)} Actions
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {store.dreams.length > 0 && store.dreams.some((dream: any) => dream.enablers?.some((enabler: any) => enabler.shortGoals?.length > 0)) ? store.dreams.map((dream: any) => dream.enablers?.map((enabler: any) => enabler.shortGoals?.map((goal: any, index: number) => <div key={index} className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer group ${goal.done ? 'bg-green-50/50 dark:bg-green-950/20 border-green-200/50 dark:border-green-800/50 hover:bg-green-50 dark:hover:bg-green-950/30' : 'bg-gray-50/50 dark:bg-gray-950/20 border-gray-200/30 dark:border-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-950/30'}`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-1.5 rounded-full mt-1 transition-colors ${goal.done ? 'bg-green-500/20 group-hover:bg-green-500/30' : 'bg-gray-500/20 group-hover:bg-gray-500/30'}`}>
                            {goal.done ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-gray-500" />}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium transition-colors ${goal.done ? 'text-green-700 dark:text-green-300 line-through' : 'text-foreground group-hover:text-green-600 dark:group-hover:text-green-400'}`}>
                              {goal.detail || goal.text}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {enabler.name || enabler.text} • {dream.text}
                            </p>
                          </div>
                          {goal.done && <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700">
                              Completed
                            </Badge>}
                        </div>
                      </div>))) : <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No short term actions yet</p>
                  <p className="text-sm text-muted-foreground/70">Actions will appear when you create goals</p>
                </div>}
            </CardContent>
          </Card>
        </div>
      </div>
      <BottomNav />
    </div>;
};