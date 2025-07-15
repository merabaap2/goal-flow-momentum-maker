
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
          
          // Load user-specific data using email as identifier
          const userDataKey = `rdm-goals-${parsedAuth.email}`;
          const existingData = localStorage.getItem(userDataKey);
          console.log('🔍 User-specific goals data:', existingData, 'for key:', userDataKey);
          
          if (existingData) {
            // Load existing goals data for this specific user
            console.log('✅ Loading existing goals data for user:', parsedAuth.email);
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
            // No existing goals data for this user
            console.log('🎯 No existing data for user:', parsedAuth.email);
            setStore({ dreams: [], overallETA: 10 }); // Reset to clean state
            
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
    
    // Get current user email for user-specific storage
    const authData = localStorage.getItem('rdm-auth');
    if (authData) {
      const parsedAuth = JSON.parse(authData);
      const userDataKey = `rdm-goals-${parsedAuth.email}`;
      localStorage.setItem(userDataKey, JSON.stringify(newStore));
      console.log('💾 Saved data for user:', parsedAuth.email, 'with key:', userDataKey);
    }
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
      
      // Check if user has existing goals using user-specific key
      const userDataKey = `rdm-goals-${email}`;
      const existingData = localStorage.getItem(userDataKey);
      console.log('🔍 Login - checking for existing data with key:', userDataKey);
      
      if (existingData) {
        console.log('✅ Found existing data for user:', email);
        setStore(JSON.parse(existingData));
        setIsFirstLaunch(false);
      } else {
        console.log('🎯 No existing data for user:', email, '- will go to wizard');
        setStore({ dreams: [], overallETA: 10 }); // Reset to clean state
        setIsFirstLaunch(true);
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
      
      console.log('📝 Signup successful - setting new user state for:', email);
      localStorage.setItem('rdm-auth', JSON.stringify({ email, name, signupTime: Date.now() }));
      setIsAuthenticated(true);
      
      // Clear any existing data and start fresh for new user
      setStore({ dreams: [], overallETA: 10 });
      setIsFirstLaunch(true); // New users should go through wizard
      console.log('🎯 Signup complete - clean slate for new user:', email);
      
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  const logout = () => {
    // Get current user before clearing auth
    const authData = localStorage.getItem('rdm-auth');
    
    localStorage.removeItem('rdm-auth');
    
    // Only remove current user's data, not all users' data
    if (authData) {
      const parsedAuth = JSON.parse(authData);
      const userDataKey = `rdm-goals-${parsedAuth.email}`;
      console.log('🚪 Logout - data preserved for user:', parsedAuth.email);
      // Note: We don't remove user data on logout, only auth data
    }
    
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
