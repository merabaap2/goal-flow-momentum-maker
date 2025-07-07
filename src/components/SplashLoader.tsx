
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoaderPulse } from './ui/LoaderPulse';
import { useApp } from '../context/AppContext';

export const SplashLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { isFirstLaunch, loading } = useApp();

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Navigate after animation completes
          setTimeout(() => {
            if (isFirstLaunch) {
              navigate('/wizard');
            } else {
              navigate('/home?tab=dashboard');
            }
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 40); // 100% in ~2 seconds

    return () => clearInterval(interval);
  }, [navigate, isFirstLaunch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F6F8] via-white to-[#F4F6F8] flex items-center justify-center">
      <LoaderPulse 
        message="Syncing your goals..."
        progress={progress}
      />
    </div>
  );
};
