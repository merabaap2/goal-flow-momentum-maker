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
  const [isOverflowing, setIsOverflowing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && value) {
      const element = inputRef.current;
      setIsOverflowing(element.scrollWidth > element.clientWidth);
    }
  }, [value]);

  const handleClick = () => {
    if (isOverflowing && document.activeElement !== inputRef.current) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    setIsExpanded(false);
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
          "border-2 rounded-lg focus:border-[#2BD192] transition-all duration-200 cursor-pointer",
          isExpanded ? "h-auto min-h-[3rem] whitespace-normal" : "h-12 truncate",
          value.trim() && "border-[#2BD192] bg-green-50/50",
          isOverflowing && !isExpanded && "hover:bg-gray-50"
        )}
        style={{
          wordWrap: isExpanded ? 'break-word' : 'normal',
          whiteSpace: isExpanded ? 'normal' : 'nowrap'
        }}
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