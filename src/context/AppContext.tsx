
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
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if user is logged in
        const authData = localStorage.getItem('rdm-auth');
        console.log('🔍 Auth check - authData:', authData);
        
        if (authData) {
          const parsedAuth = JSON.parse(authData);
          console.log('🔍 Parsed auth:', parsedAuth);
          setIsAuthenticated(true);
          
          // Load user data only for login (not signup)
          const existingData = localStorage.getItem('rdm-goals');
          console.log('🔍 Existing goals data:', existingData);
          
          if (existingData) {
            // Load existing goals data regardless of login/signup status
            console.log('✅ Loading existing goals data');
            setStore(JSON.parse(existingData));
            
            if (parsedAuth.loginTime) {
              // Returning user with goals - skip wizard
              console.log('✅ Returning user with goals - going to dashboard');
              setIsFirstLaunch(false);
            } else if (parsedAuth.signupTime) {
              // New signup user with goals (shouldn't happen but handle it)
              console.log('🎯 Signup user with existing goals - going to wizard');
              setIsFirstLaunch(true);
            }
          } else {
            // No existing goals data
            if (parsedAuth.signupTime) {
              console.log('🎯 New signup user - going to wizard');
              setIsFirstLaunch(true);
            } else if (parsedAuth.loginTime) {
              console.log('🎯 Returning user without goals - going to wizard');
              setIsFirstLaunch(true);
            }
          }
        }
        
        console.log('🚀 Final isFirstLaunch state:', isFirstLaunch);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setTimeout(() => setLoading(false), 2000);
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
    setIsFirstLaunch(false);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('rdm-auth', JSON.stringify({ email, loginTime: Date.now() }));
      setIsAuthenticated(true);
      
      // Check if user has existing goals
      const existingData = localStorage.getItem('rdm-goals');
      if (existingData) {
        setStore(JSON.parse(existingData));
        setIsFirstLaunch(false);
      }
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('📝 Signup successful - setting new user state');
      localStorage.setItem('rdm-auth', JSON.stringify({ email, name, signupTime: Date.now() }));
      setIsAuthenticated(true);
      setIsFirstLaunch(true); // New users should go through wizard
      console.log('🎯 Signup complete - isFirstLaunch set to true');
      
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('rdm-auth');
    localStorage.removeItem('rdm-goals');
    setIsAuthenticated(false);
    setIsFirstLaunch(true);
    setStore({ dreams: [], overallETA: 10 });
  };

  return (
    <AppContext.Provider value={{
      store,
      updateStore,
      addDream,
      isFirstLaunch,
      setIsFirstLaunch,
      loading,
      setLoading,
      isAuthenticated,
      setIsAuthenticated,
      login,
      signup,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};
