
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
            console.log('🚀 SplashLoader navigation - isFirstLaunch:', isFirstLaunch);
            if (isFirstLaunch) {
              console.log('✨ Navigating to simple-wizard');
              navigate('/simple-wizard');
            } else {
              console.log('🏠 Navigating to dashboard');
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
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-[#2BD192] to-[#05C2FF] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
          <span className="text-white font-bold text-3xl">R</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2BD192] to-[#05C2FF] bg-clip-text text-transparent mb-4">RDM</h1>
        <LoaderPulse 
          message="Syncing your goals..."
          progress={progress}
        />
      </div>
    </div>
  );
};
