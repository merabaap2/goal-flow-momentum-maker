import React, { useState, useRef, useEffect } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (value && value.length > 20) { // Simple check for long text
      setIsExpanded(!isExpanded);
    }
  };

  const handleFocus = () => {
    if (value && value.length > 20) {
      setIsExpanded(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsExpanded(false);
    }, 150); // Small delay to allow for interactions
  };

  return (
    <div className="relative group">
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "border-2 rounded-lg focus:border-[#2BD192] transition-all duration-200",
          isExpanded 
            ? "h-auto min-h-[3rem] py-3 px-3 whitespace-normal overflow-wrap-anywhere" 
            : "h-12 truncate hover:bg-gray-50 cursor-pointer",
          value.trim() && "border-[#2BD192] bg-green-50/50"
        )}
        style={{
          resize: 'none',
          whiteSpace: isExpanded ? 'normal' : 'nowrap',
          wordBreak: isExpanded ? 'break-word' : 'normal'
        }}
        title={value && value.length > 20 ? "Click to expand/collapse" : undefined}
      />
      {showRemove && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-3 right-3 p-1 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};