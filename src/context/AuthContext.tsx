import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthContextType, User } from '../types/auth';
import { mockLoginAPI, saveToken, getToken, clearToken } from '../utils/mockAuth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay sesión guardada al cargar
  useEffect(() => {
    const token = getToken();
    if (token) {
      const savedUser = localStorage.getItem('user_data');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedUser = await mockLoginAPI({ email, password });
      setUser(loggedUser);
      
      // Simular token
      const token = `token_${loggedUser.id}`;
      saveToken(token);
      localStorage.setItem('user_data', JSON.stringify(loggedUser));
    } catch (error) {
      setUser(null);
      clearToken();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    clearToken();
    localStorage.removeItem('user_data');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};