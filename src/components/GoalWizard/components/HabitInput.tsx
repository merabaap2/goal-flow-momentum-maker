import React from 'react';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitInputProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  showRemove: boolean;
}

export const HabitInput: React.FC<HabitInputProps> = ({
  value,
  placeholder,
  onChange,
  onRemove,
  showRemove,
}) => {
  return (
    <div className="relative group">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-12 border-2 rounded-lg focus:border-[#2BD192] transition-all duration-200 truncate",
          value.trim() && "border-[#2BD192] bg-green-50/50"
        )}
      />
      {showRemove && onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 p-1 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};