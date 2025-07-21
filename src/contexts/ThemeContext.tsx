import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface ChatbotTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  botMessageColor: string;
  userMessageColor: string;
  headerColor: string;
  buttonColor: string;
  companyName: string;
  companyLogo: string;
  welcomeMessage: string;
}

interface ThemeContextType {
  theme: ChatbotTheme;
  updateTheme: (newTheme: Partial<ChatbotTheme>) => void;
  saveTheme: () => Promise<boolean>;
  loading: boolean;
}

const defaultTheme: ChatbotTheme = {
  primaryColor: "#1d4ed8",
  secondaryColor: "#589ee4",
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  headerColor: "#589ee4",
  buttonColor: "#1d4ed8",
  botMessageColor: "#f8fafc",
  userMessageColor: "#1d4ed8",
  companyName: "Your Company",
  companyLogo: '',
  welcomeMessage: 'Hello! How can I help you today?',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ChatbotTheme>(defaultTheme);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/theme');
      setTheme({ ...defaultTheme, ...response.data });
    } catch (error) {
      console.error('Failed to fetch theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = (newTheme: Partial<ChatbotTheme>) => {
    setTheme(prev => ({ ...prev, ...newTheme }));
  };

  const saveTheme = async (): Promise<boolean> => {
    try {
      await axios.put('http://localhost:5000/api/theme', theme);
      return true;
    } catch (error) {
      console.error('Failed to save theme:', error);
      return false;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, saveTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};