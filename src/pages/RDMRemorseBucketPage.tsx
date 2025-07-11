import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const RDMRemorseBucketPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/home?tab=dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">RDM Remorse Bucket</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Remorse Bucket</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This page will show detailed information about your RDM remorse bucket.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};