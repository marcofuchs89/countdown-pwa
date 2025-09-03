import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const lightTheme = {
  name: 'light',
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#212529',
    textSecondary: '#6c757d',
    border: '#dee2e6',
    hover: '#e9ecef',
    shadow: 'rgba(0, 0, 0, 0.1)',
    accent: '#e3f2fd'
  },
  fonts: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    size: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '1.5rem',
      xxlarge: '2rem'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    round: '50%'
  }
};

const darkTheme = {
  ...lightTheme,
  name: 'dark',
  colors: {
    primary: '#4dabf7',
    secondary: '#868e96',
    success: '#51cf66',
    danger: '#ff6b6b',
    warning: '#ffd43b',
    info: '#74c0fc',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#adb5bd',
    border: '#373a40',
    hover: '#2c2e33',
    shadow: 'rgba(0, 0, 0, 0.3)',
    accent: '#1a1a1a'
  }
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setCurrentTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setCurrentTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app-theme', currentTheme);
    document.body.className = `theme-${currentTheme}`;
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const theme = currentTheme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
