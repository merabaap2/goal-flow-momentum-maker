import React from 'react';
import { AddDreamForm } from '@/components/AddDreamForm';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const AddBucketItemPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (dream: {
    description: string;
    timeline: number;
    pledgeAmount: number;
    currency: 'USDT' | 'RDM';
  }) => {
    // Here you would typically save to your backend/context
    console.log('New bucket list item:', dream);
    
    toast({
      title: "Dream Added!",
      description: `"${dream.description}" has been added to your bucket list.`,
    });

    // Navigate back to bucket list or home
    navigate('/');
  };

  return <AddDreamForm onSubmit={handleSubmit} />;
};