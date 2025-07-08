import React, { createContext, useContext, ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';
import { CompanyConfig } from '../config/company';

interface ThemeContextType {
  config: CompanyConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const config = useTheme();

  return (
    <ThemeContext.Provider value={{ config }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useCompanyConfig = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useCompanyConfig must be used within a ThemeProvider');
  }
  return context.config;
};