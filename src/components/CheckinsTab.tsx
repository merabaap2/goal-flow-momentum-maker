
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HabitCheckbox } from './ui/HabitCheckbox';
import { toast } from 'sonner';

export const CheckinsTab: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock daily habits
  const [habits, setHabits] = useState([
    { id: '1', detail: 'Read for 30 minutes', streak: 5, checked: false },
    { id: '2', detail: 'Exercise for 20 minutes', streak: 3, checked: false },
    { id: '3', detail: 'Write in journal', streak: 0, checked: false },
    { id: '4', detail: 'Practice coding', streak: 7, checked: true },
  ]);

  const handleHabitToggle = (habitId: string, checked: boolean) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const newStreak = checked ? habit.streak + 1 : Math.max(0, habit.streak - 1);
        if (checked) {
          toast.success('✅ +1 day logged', {
            description: `${habit.detail} - ${newStreak} day streak!`
          });
          // Navigate to rewards and remorse page when habit is completed
          setTimeout(() => {
            navigate('/rdm-rewards-earned');
          }, 1500); // Delay to show the toast first
        }
        return { ...habit, checked, streak: newStreak };
      }
      return habit;
    }));
  };

  const completedToday = habits.filter(h => h.checked).length;
  const totalHabits = habits.length;
  const progressPercent = (completedToday / totalHabits) * 100;

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-[#374151]">Daily Check-ins</h1>
        <p className="text-gray-600">Build consistency, one day at a time</p>
      </div>

      {/* Progress Summary */}
      <div className="bg-gradient-to-r from-[#2BD192] to-[#05C2FF] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Today's Progress</h3>
            <p className="text-white/80">{completedToday} of {totalHabits} habits completed</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{Math.round(progressPercent)}%</div>
          </div>
        </div>
        <div className="mt-4 w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-[#374151]">Today's Habits</h2>
        {habits.map(habit => (
          <HabitCheckbox
            key={habit.id}
            id={habit.id}
            label={habit.detail}
            streak={habit.streak}
            checked={habit.checked}
            onCheckedChange={(checked) => handleHabitToggle(habit.id, checked)}
          />
        ))}
      </div>
    </div>
  );
};
