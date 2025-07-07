import React from 'react';
import { Plus } from 'lucide-react';

interface AddHabitButtonProps {
  onClick: () => void;
}

export const AddHabitButton: React.FC<AddHabitButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 border-2 border-dashed border-[#2BD192] rounded-lg text-[#2BD192] hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-2"
    >
      <Plus className="h-4 w-4" />
      <span>Add another daily habit</span>
    </button>
  );
};