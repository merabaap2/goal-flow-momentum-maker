
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Store, Dream } from '../types';

interface AppContextType {
  store: Store;
  updateStore: (store: Store) => void;
  addDream: (dream: Dream) => void;
  isFirstLaunch: boolean;
  setIsFirstLaunch: (value: boolean) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [store, setStore] = useState<Store>({
    dreams: [],
    overallETA: 10
  });
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and check for existing data
    const loadData = async () => {
      try {
        const existingData = localStorage.getItem('rdm-goals');
        if (existingData) {
          setStore(JSON.parse(existingData));
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
      }
    };

    loadData();
  }, []);

  const updateStore = (newStore: Store) => {
    setStore(newStore);
    localStorage.setItem('rdm-goals', JSON.stringify(newStore));
  };

  const addDream = (dream: Dream) => {
    const newStore = {
      ...store,
      dreams: [...store.dreams, dream]
    };
    updateStore(newStore);
  };

  return (
    <AppContext.Provider value={{
      store,
      updateStore,
      addDream,
      isFirstLaunch,
      setIsFirstLaunch,
      loading,
      setLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};
