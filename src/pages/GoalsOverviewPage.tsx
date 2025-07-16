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
      <div className="mx-auto p-4 space-y-4">
        {/* Compact Mobile Header */}
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-border/20">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/home?tab=dashboard')}
            className="h-9 w-9 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate">
              Goals Overview
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-lg p-2">
              <Activity className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>

        {/* Mobile-First Layout */}
        <div className="space-y-4">
          {/* Bucket List Section */}
          <Card className="group hover:shadow-lg transition-all duration-300 border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <span className="flex-1 text-primary font-semibold">Bucket List Dreams</span>
                <Badge variant="secondary" className="text-xs bg-primary/10">
                  {store.dreams.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {store.dreams.length > 0 ? store.dreams.map((dream: any, index: number) => (
                <div 
                  key={index} 
                  className="p-3 bg-white/70 rounded-lg border border-primary/20 hover:bg-white transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-primary/20 rounded-lg mt-0.5">
                      <Target className="h-3 w-3 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm leading-relaxed">
                        {dream.text}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        🌟 Long-term aspiration
                      </p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6">
                  <Star className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No dreams yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medium Term Dreams Section */}
          <Card className="group hover:shadow-lg transition-all duration-300 border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/10 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-500" />
                </div>
                <span className="flex-1 text-blue-500 font-semibold">Medium Term Dreams</span>
                <Badge variant="secondary" className="text-xs bg-blue-500/10">
                  {store.dreams.reduce((acc: number, dream: any) => acc + (dream.enablers?.length || 0), 0)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              {store.dreams.length > 0 && store.dreams.some((dream: any) => dream.enablers?.length > 0) ? 
                store.dreams.map((dream: any) => dream.enablers?.map((enabler: any, index: number) => (
                  <div 
                    key={index} 
                    className="p-3 bg-white/70 rounded-lg border border-blue-500/20 hover:bg-white transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-blue-500/20 rounded-lg mt-0.5">
                        <TrendingUp className="h-3 w-3 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm leading-relaxed">
                          {enabler.name || enabler.text}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          🎯 {dream.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))) : (
                <div className="text-center py-6">
                  <Calendar className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No medium term dreams yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Short Term Actions Section */}
          <Card className="group hover:shadow-lg transition-all duration-300 border border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Clock className="h-4 w-4 text-green-500" />
                </div>
                <span className="flex-1 text-green-500 font-semibold">Short Term Actions</span>
                <Badge variant="secondary" className="text-xs bg-green-500/10">
                  {store.dreams.reduce((acc: number, dream: any) => acc + (dream.enablers?.reduce((enablerAcc: number, enabler: any) => enablerAcc + (enabler.shortGoals?.length || 0), 0) || 0), 0)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                {store.dreams.length > 0 && store.dreams.some((dream: any) => dream.enablers?.some((enabler: any) => enabler.shortGoals?.length > 0)) ? 
                  store.dreams.map((dream: any) => dream.enablers?.map((enabler: any) => enabler.shortGoals?.map((goal: any, index: number) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                        goal.done 
                          ? 'bg-green-50/80 dark:bg-green-950/30 border-green-200/50 dark:border-green-800/50' 
                          : 'bg-white/70 dark:bg-gray-950/30 border-gray-200/30 dark:border-gray-800/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-lg mt-0.5 ${
                          goal.done ? 'bg-green-500/20' : 'bg-gray-500/20'
                        }`}>
                          {goal.done ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Clock className="h-3 w-3 text-gray-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm leading-relaxed ${
                            goal.done 
                              ? 'text-green-700 dark:text-green-300 line-through' 
                              : 'text-foreground'
                          }`}>
                            {goal.detail || goal.text}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            ⚡ {enabler.name || enabler.text}
                          </p>
                          {goal.done && (
                            <Badge variant="outline" className="mt-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700">
                              ✅ Done
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )))) : (
                  <div className="text-center py-6">
                    <Clock className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">No short term actions yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <BottomNav />
    </div>;
};