
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HabitCheckboxProps {
  id: string;
  label: string;
  streak: number;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export const HabitCheckbox: React.FC<HabitCheckboxProps> = ({
  id,
  label,
  streak,
  checked,
  onCheckedChange,
  className
}) => {
  return (
    <div className={cn(
      'flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200',
      className
    )}>
      <div className="flex items-center space-x-3">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="data-[state=checked]:bg-[#2BD192] data-[state=checked]:border-[#2BD192]"
        />
        <label 
          htmlFor={id}
          className={cn(
            'text-[#374151] font-medium cursor-pointer transition-all duration-200',
            checked && 'line-through text-gray-400'
          )}
        >
          {label}
        </label>
      </div>
      {streak > 0 && (
        <Badge 
          variant="secondary" 
          className="bg-gradient-to-r from-[#2BD192] to-[#05C2FF] text-white font-semibold animate-pulse"
        >
          🔥 {streak} days
        </Badge>
      )}
    </div>
  );
};
