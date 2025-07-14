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
  const { store } = useApp();

  return (
    <div className="min-h-screen bg-background pb-20">
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

        {/* Total List Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Total list</h2>
          
          {/* Bucket List Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foreground underline">Bucket list:</h3>
            {store.dreams.length > 0 ? (
              store.dreams.map((dream: any, index: number) => (
                <div key={index} className="pl-4">
                  <p className="text-foreground">{dream.text}</p>
                </div>
              ))
            ) : (
              <div className="pl-4">
                <p className="text-muted-foreground italic">No bucket list items yet</p>
              </div>
            )}
          </div>

          {/* Medium Term Dreams Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foreground underline">Medium term Dream:</h3>
            {store.dreams.length > 0 && store.dreams.some((dream: any) => dream.enablers?.length > 0) ? (
              store.dreams.map((dream: any) => 
                dream.enablers?.map((enabler: any, index: number) => (
                  <div key={index} className="pl-4">
                    <p className="text-foreground">{enabler.name || enabler.text}</p>
                  </div>
                ))
              )
            ) : (
              <div className="pl-4">
                <p className="text-muted-foreground italic">No medium term goals yet</p>
              </div>
            )}
          </div>

          {/* Short Term Dreams Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foreground underline">Short term Dream:</h3>
            {store.dreams.length > 0 && store.dreams.some((dream: any) => 
              dream.enablers?.some((enabler: any) => enabler.shortGoals?.length > 0)
            ) ? (
              store.dreams.map((dream: any) => 
                dream.enablers?.map((enabler: any) =>
                  enabler.shortGoals?.map((goal: any, index: number) => (
                    <div key={index} className="pl-4">
                      <p className="text-foreground">{goal.detail || goal.text}</p>
                    </div>
                  ))
                )
              )
            ) : (
              <div className="pl-4">
                <p className="text-muted-foreground italic">No short term goals yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};