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
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Interactive Header with Gradient Background */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-3xl p-8 border-2 border-gradient-to-r from-primary/20 to-accent/20">
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
          <div className="relative flex items-center gap-6">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/home?tab=dashboard')}
              className="hover:scale-110 hover:rotate-6 transition-all duration-300 hover:shadow-lg bg-white/80 backdrop-blur-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-fade-in">
                Total Bucket List Overview
              </h1>
              <p className="text-muted-foreground mt-2 animate-fade-in">Track your journey from dreams to reality</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center hover:scale-105 transition-transform duration-300">
                <Activity className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-sm font-medium">Active Goals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bucket List Section - Full Width on Mobile, 5 cols on Desktop */}
          <div className="lg:col-span-5">
            <Card className="h-full group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                      Bucket List Dreams
                    </span>
                  </div>
                  <Badge variant="secondary" className="animate-pulse bg-primary/10 hover:bg-primary/20 transition-colors">
                    {store.dreams.length} {store.dreams.length === 1 ? 'Dream' : 'Dreams'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10">
                {store.dreams.length > 0 ? store.dreams.map((dream: any, index: number) => (
                  <div 
                    key={index} 
                    className="p-5 bg-white/50 backdrop-blur-sm rounded-xl border border-primary/20 hover:bg-white/70 hover:border-primary/40 transition-all duration-300 cursor-pointer group/item hover:scale-[1.02] hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/20 rounded-xl group-hover/item:bg-primary/30 group-hover/item:scale-110 transition-all duration-300">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground group-hover/item:text-primary transition-colors duration-300 text-lg">
                          {dream.text}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2 group-hover/item:text-primary/70 transition-colors">
                          🌟 Big picture dream • Long-term aspiration
                        </p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 group/empty">
                    <div className="relative">
                      <Star className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4 group-hover/empty:scale-110 group-hover/empty:text-primary/50 transition-all duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 border-2 border-dashed border-muted-foreground/20 rounded-full group-hover/empty:border-primary/40 transition-colors duration-500"></div>
                      </div>
                    </div>
                    <p className="text-muted-foreground font-medium">No bucket list dreams yet</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">Start by creating your first dream!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Medium Term Dreams Section - 7 cols on Desktop */}
          <div className="lg:col-span-7">
            <Card className="h-full group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-blue-500/10 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-500/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                      Medium Term Dreams
                    </span>
                  </div>
                  <Badge variant="secondary" className="animate-pulse bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
                    {store.dreams.reduce((acc: number, dream: any) => acc + (dream.enablers?.length || 0), 0)} Goals
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10 max-h-80 overflow-y-auto custom-scrollbar">
                {store.dreams.length > 0 && store.dreams.some((dream: any) => dream.enablers?.length > 0) ? 
                  store.dreams.map((dream: any) => dream.enablers?.map((enabler: any, index: number) => (
                    <div 
                      key={index} 
                      className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-blue-500/20 hover:bg-white/70 hover:border-blue-500/40 transition-all duration-300 cursor-pointer group/item hover:scale-[1.02] hover:shadow-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-xl group-hover/item:bg-blue-500/30 group-hover/item:scale-110 transition-all duration-300">
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors duration-300">
                            {enabler.name || enabler.text}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1 group-hover/item:text-blue-500/70 transition-colors">
                            🎯 Stepping stone • {dream.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))) : (
                  <div className="text-center py-12 group/empty">
                    <div className="relative">
                      <Calendar className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4 group-hover/empty:scale-110 group-hover/empty:text-blue-500/50 transition-all duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 border-2 border-dashed border-muted-foreground/20 rounded-full group-hover/empty:border-blue-500/40 transition-colors duration-500"></div>
                      </div>
                    </div>
                    <p className="text-muted-foreground font-medium">No medium term dreams yet</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">Goals will appear when you create dreams</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Short Term Actions Section - Full Width */}
          <div className="lg:col-span-12">
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] border-2 hover:border-green-500/30 bg-gradient-to-br from-green-500/5 to-green-500/10 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-500/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                      Short Term Actions
                    </span>
                  </div>
                  <Badge variant="secondary" className="animate-pulse bg-green-500/10 hover:bg-green-500/20 transition-colors">
                    {store.dreams.reduce((acc: number, dream: any) => acc + (dream.enablers?.reduce((enablerAcc: number, enabler: any) => enablerAcc + (enabler.shortGoals?.length || 0), 0) || 0), 0)} Actions
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {store.dreams.length > 0 && store.dreams.some((dream: any) => dream.enablers?.some((enabler: any) => enabler.shortGoals?.length > 0)) ? 
                    store.dreams.map((dream: any) => dream.enablers?.map((enabler: any) => enabler.shortGoals?.map((goal: any, index: number) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer group/item hover:scale-[1.02] hover:shadow-lg ${
                          goal.done 
                            ? 'bg-green-50/80 dark:bg-green-950/30 border-green-200/50 dark:border-green-800/50 hover:bg-green-50 dark:hover:bg-green-950/40' 
                            : 'bg-white/50 dark:bg-gray-950/30 border-gray-200/30 dark:border-gray-800/30 hover:bg-white/70 dark:hover:bg-gray-950/40'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl transition-all duration-300 group-hover/item:scale-110 ${
                            goal.done ? 'bg-green-500/20 group-hover/item:bg-green-500/30' : 'bg-gray-500/20 group-hover/item:bg-gray-500/30'
                          }`}>
                            {goal.done ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-gray-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium transition-colors duration-300 ${
                              goal.done 
                                ? 'text-green-700 dark:text-green-300 line-through' 
                                : 'text-foreground group-hover/item:text-green-600 dark:group-hover/item:text-green-400'
                            }`}>
                              {goal.detail || goal.text}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1 truncate">
                              ⚡ {enabler.name || enabler.text} • {dream.text}
                            </p>
                          </div>
                          {goal.done && (
                            <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 animate-pulse">
                              ✅ Done
                            </Badge>
                          )}
                        </div>
                      </div>
                    )))) : (
                    <div className="col-span-full text-center py-12 group/empty">
                      <div className="relative">
                        <Clock className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4 group-hover/empty:scale-110 group-hover/empty:text-green-500/50 transition-all duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 border-2 border-dashed border-muted-foreground/20 rounded-full group-hover/empty:border-green-500/40 transition-colors duration-500"></div>
                        </div>
                      </div>
                      <p className="text-muted-foreground font-medium">No short term actions yet</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">Actions will appear when you create goals</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>;
};