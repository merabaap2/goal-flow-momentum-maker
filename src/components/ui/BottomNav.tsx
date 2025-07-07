import React from 'react';
import { Home, CheckSquare, TrendingUp, User, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: Home,
      path: '/home?tab=dashboard'
    },
    {
      id: 'checkins',
      label: 'Check-ins',
      icon: CheckSquare,
      path: '/home?tab=checkins'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: TrendingUp,
      path: '/home?tab=progress'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/home?tab=profile'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/home?tab=settings'
    }
  ];

  const getCurrentTab = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'dashboard';
  };

  const currentTab = getCurrentTab();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl z-50",
      className
    )}>
      <div className="safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 min-w-[64px] relative",
                  isActive 
                    ? "text-white" 
                    : "text-gray-500 hover:text-[#2BD192] hover:bg-gray-50"
                )}
              >
                {/* Active background with gradient */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2BD192] to-[#05C2FF] rounded-xl shadow-lg" />
                )}
                
                {/* Icon and label */}
                <div className="relative z-10 flex flex-col items-center space-y-1">
                  <item.icon className={cn(
                    "h-5 w-5 transition-all duration-200",
                    isActive ? "scale-110" : ""
                  )} />
                  <span className={cn(
                    "text-xs font-medium transition-all duration-200",
                    isActive ? "font-semibold" : ""
                  )}>
                    {item.label}
                  </span>
                </div>

                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};